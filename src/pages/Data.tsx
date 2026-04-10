import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Treemap, Legend,
} from 'recharts';

const COLORS = [
  'hsl(215, 30%, 45%)', 'hsl(0, 55%, 45%)', 'hsl(150, 40%, 40%)',
  'hsl(45, 70%, 50%)', 'hsl(280, 30%, 50%)', 'hsl(180, 40%, 40%)',
  'hsl(30, 60%, 50%)', 'hsl(330, 40%, 45%)', 'hsl(100, 35%, 45%)',
  'hsl(200, 50%, 50%)',
];

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="brutalist-border p-4 bg-card">
      <div className="text-3xl font-extrabold tracking-tighter">{value}</div>
      <div className="text-xs font-mono text-muted-foreground uppercase mt-1">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function useDataStats() {
  return useQuery({
    queryKey: ['data-stats'],
    queryFn: async () => {
      const [politicians, events, countryData, partyData, jurisdictionData, eventTypeData, enrichmentData, epGroupData] = await Promise.all([
        supabase.from('politicians').select('id', { count: 'exact', head: true }),
        supabase.from('political_events').select('id', { count: 'exact', head: true }),
        supabase.from('politicians').select('country_name, country_code'),
        supabase.from('politicians').select('party_name, country_name'),
        supabase.from('politicians').select('jurisdiction'),
        supabase.from('political_events').select('event_type'),
        supabase.from('politicians').select('enriched_at'),
        supabase.from('politicians').select('party_name').not('party_name', 'is', null),
      ]);

      // Country breakdown
      const countryCounts: Record<string, { count: number; code: string }> = {};
      (countryData.data || []).forEach((p: any) => {
        if (!p.country_name) return;
        if (!countryCounts[p.country_name]) countryCounts[p.country_name] = { count: 0, code: p.country_code };
        countryCounts[p.country_name].count++;
      });
      const byCountry = Object.entries(countryCounts)
        .map(([name, { count, code }]) => ({ name, count, code }))
        .sort((a, b) => b.count - a.count);

      // EP Group breakdown
      const groupCounts: Record<string, number> = {};
      (epGroupData.data || []).forEach((p: any) => {
        const group = p.party_name || 'Unknown';
        // Shorten long EP group names
        const short = group
          .replace("Group of the European People's Party (Christian Democrats)", 'EPP')
          .replace('Group of the Progressive Alliance of Socialists and Democrats in the European Parliament', 'S&D')
          .replace('Renew Europe Group', 'Renew')
          .replace('Group of the Greens/European Free Alliance', 'Greens/EFA')
          .replace('European Conservatives and Reformists Group', 'ECR')
          .replace('The Left group in the European Parliament - GUE/NGL', 'The Left')
          .replace('Patriots for Europe Group', 'Patriots')
          .replace('Europe of Sovereign Nations Group', 'ESN')
          .replace('Non-attached Members', 'Non-attached');
        groupCounts[short] = (groupCounts[short] || 0) + 1;
      });
      const byGroup = Object.entries(groupCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

      // Jurisdiction breakdown
      const jurisdictions: Record<string, number> = {};
      (jurisdictionData.data || []).forEach((p: any) => {
        const j = p.jurisdiction || 'unknown';
        jurisdictions[j] = (jurisdictions[j] || 0) + 1;
      });
      const byJurisdiction = Object.entries(jurisdictions)
        .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }))
        .sort((a, b) => b.count - a.count);

      // Event types
      const eventTypes: Record<string, number> = {};
      (eventTypeData.data || []).forEach((e: any) => {
        const t = e.event_type || 'unknown';
        eventTypes[t] = (eventTypes[t] || 0) + 1;
      });
      const byEventType = Object.entries(eventTypes)
        .map(([name, count]) => ({ name: name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), count }))
        .sort((a, b) => b.count - a.count);

      // Enrichment stats
      const enriched = (enrichmentData.data || []).filter((p: any) => p.enriched_at).length;
      const total = enrichmentData.data?.length || 0;

      // National parties (top 20)
      const nationalParties: Record<string, { count: number; country: string }> = {};
      (partyData.data || []).forEach((p: any) => {
        const party = p.party_name;
        if (!party) return;
        // Only count non-EP-group parties (national parties stored in party_abbreviation field)
        if (!nationalParties[party]) nationalParties[party] = { count: 0, country: p.country_name };
        nationalParties[party].count++;
      });

      // Treemap data for country breakdown
      const treemapData = byCountry.map((c, i) => ({
        name: c.code || c.name,
        size: c.count,
        fullName: c.name,
        fill: COLORS[i % COLORS.length],
      }));

      return {
        totalPoliticians: politicians.count || 0,
        totalEvents: events.count || 0,
        totalCountries: byCountry.length,
        totalParties: Object.keys(nationalParties).length,
        enriched,
        enrichmentPct: total > 0 ? Math.round((enriched / total) * 100) : 0,
        byCountry,
        byGroup,
        byJurisdiction,
        byEventType,
        treemapData,
      };
    },
  });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="brutalist-border bg-background p-2 text-xs font-mono">
      <p className="font-bold">{label || payload[0]?.name}</p>
      <p>{payload[0]?.value} politicians</p>
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="brutalist-border bg-background p-2 text-xs font-mono">
      <p className="font-bold">{payload[0]?.name}</p>
      <p>{payload[0]?.value} ({((payload[0]?.value / payload[0]?.payload?.total) * 100).toFixed(1)}%)</p>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }: any) => {
  if (percent < 0.04) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-mono font-bold">
      {name.length > 8 ? name.slice(0, 7) + '…' : name}
    </text>
  );
};

const Data = () => {
  const { data: stats, isLoading } = useDataStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container py-12 text-center font-mono text-muted-foreground">
          Loading data…
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!stats) return null;

  const total = stats.byJurisdiction.reduce((s, j) => s + j.count, 0);
  const jurisdictionWithTotal = stats.byJurisdiction.map(j => ({ ...j, total }));
  const eventTotal = stats.byEventType.reduce((s, e) => s + e.count, 0);
  const eventsWithTotal = stats.byEventType.map(e => ({ ...e, total: eventTotal }));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter">DATA OBSERVATORY</h1>
          <p className="text-sm font-mono text-muted-foreground mt-1">
            Live statistics from {stats.totalPoliticians.toLocaleString()} politicians across {stats.totalCountries} EU countries
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Politicians" value={stats.totalPoliticians.toLocaleString()} />
          <StatCard label="Countries" value={stats.totalCountries} />
          <StatCard label="Parties" value={stats.totalParties} />
          <StatCard label="Events" value={stats.totalEvents.toLocaleString()} />
          <StatCard label="Wikipedia" value={`${stats.enrichmentPct}%`} sub={`${stats.enriched} enriched`} />
          <StatCard label="MEPs" value={stats.byJurisdiction.find(j => j.name === 'Eu')?.count || 0} />
        </div>

        {/* Row 1: Politicians per Country (bar chart) */}
        <section>
          <h2 className="text-lg font-extrabold tracking-tight mb-4 font-mono">POLITICIANS PER COUNTRY</h2>
          <div className="brutalist-border bg-card p-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats.byCountry} margin={{ top: 5, right: 5, left: 5, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="code"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Row 2: EP Groups + Jurisdiction */}
        <div className="grid md:grid-cols-2 gap-6">
          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-4 font-mono">EP POLITICAL GROUPS</h2>
            <div className="brutalist-border bg-card p-4">
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={stats.byGroup} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    width={80}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-4 font-mono">BY JURISDICTION</h2>
            <div className="brutalist-border bg-card p-4">
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <Pie
                    data={jurisdictionWithTotal}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    {jurisdictionWithTotal.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    formatter={(value: string) => <span className="text-xs font-mono">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Row 3: Event Types + Country table */}
        <div className="grid md:grid-cols-2 gap-6">
          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-4 font-mono">EVENT TYPES</h2>
            <div className="brutalist-border bg-card p-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventsWithTotal}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    {eventsWithTotal.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    formatter={(value: string) => <span className="text-xs font-mono">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-4 font-mono">COUNTRY BREAKDOWN</h2>
            <div className="brutalist-border bg-card overflow-hidden">
              <div className="max-h-[340px] overflow-y-auto">
                <table className="w-full text-xs font-mono">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border">
                      <th className="text-left p-2 font-bold">COUNTRY</th>
                      <th className="text-right p-2 font-bold">CODE</th>
                      <th className="text-right p-2 font-bold">COUNT</th>
                      <th className="text-left p-2 font-bold w-1/3">DISTRIBUTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byCountry.map((c, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="p-2">{c.name}</td>
                        <td className="p-2 text-right text-muted-foreground">{c.code}</td>
                        <td className="p-2 text-right font-bold">{c.count}</td>
                        <td className="p-2">
                          <div className="h-3 bg-muted rounded-sm overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-sm"
                              style={{ width: `${(c.count / stats.byCountry[0].count) * 100}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Row 4: Top EP Groups table */}
        <section>
          <h2 className="text-lg font-extrabold tracking-tight mb-4 font-mono">EP GROUP MEMBERSHIP</h2>
          <div className="brutalist-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-bold">EP GROUP</th>
                    <th className="text-right p-3 font-bold">MEMBERS</th>
                    <th className="text-right p-3 font-bold">% OF TOTAL</th>
                    <th className="text-left p-3 font-bold w-1/2">SHARE</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.byGroup.map((g, i) => {
                    const pct = ((g.count / stats.totalPoliticians) * 100).toFixed(1);
                    return (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="p-3 font-medium">{g.name}</td>
                        <td className="p-3 text-right font-bold">{g.count}</td>
                        <td className="p-3 text-right text-muted-foreground">{pct}%</td>
                        <td className="p-3">
                          <div className="h-4 bg-muted rounded-sm overflow-hidden">
                            <div
                              className="h-full rounded-sm"
                              style={{
                                width: `${(g.count / stats.byGroup[0].count) * 100}%`,
                                backgroundColor: COLORS[i % COLORS.length],
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Data freshness */}
        <section>
          <h2 className="text-lg font-extrabold tracking-tight mb-4 font-mono">DATA SOURCES</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="brutalist-border p-4 bg-card">
              <div className="text-sm font-bold">European Parliament</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">718 MEPs · XML directory</div>
              <div className="text-xs text-accent mt-2">europarl.europa.eu</div>
            </div>
            <div className="brutalist-border p-4 bg-card">
              <div className="text-sm font-bold">Wikipedia</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">{stats.enriched} enriched · REST API</div>
              <div className="text-xs text-accent mt-2">en.wikipedia.org</div>
            </div>
            <div className="brutalist-border p-4 bg-card">
              <div className="text-sm font-bold">Public RSS Feeds</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">{stats.totalEvents} events · EU sources</div>
              <div className="text-xs text-accent mt-2">ec.europa.eu · consilium.europa.eu</div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Data;
