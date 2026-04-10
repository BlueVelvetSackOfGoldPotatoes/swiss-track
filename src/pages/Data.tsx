import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

const COLORS = [
  'hsl(215, 30%, 45%)', 'hsl(0, 55%, 45%)', 'hsl(150, 40%, 40%)',
  'hsl(45, 70%, 50%)', 'hsl(280, 30%, 50%)', 'hsl(180, 40%, 40%)',
  'hsl(30, 60%, 50%)', 'hsl(330, 40%, 45%)', 'hsl(100, 35%, 45%)',
  'hsl(200, 50%, 50%)',
];

// EU country reference data (2024 estimates)
const EU_COUNTRY_DATA: Record<string, { population: number; gdp: number; area: number }> = {
  DE: { population: 84_482_000, gdp: 4_456, area: 357_022 },
  FR: { population: 68_170_000, gdp: 3_049, area: 551_695 },
  IT: { population: 58_850_000, gdp: 2_186, area: 301_340 },
  ES: { population: 48_345_000, gdp: 1_582, area: 505_990 },
  PL: { population: 37_750_000, gdp: 842, area: 312_696 },
  RO: { population: 19_038_000, gdp: 351, area: 238_397 },
  NL: { population: 17_811_000, gdp: 1_092, area: 41_543 },
  BE: { population: 11_686_000, gdp: 624, area: 30_528 },
  CZ: { population: 10_827_000, gdp: 335, area: 78_871 },
  GR: { population: 10_394_000, gdp: 239, area: 131_957 },
  PT: { population: 10_379_000, gdp: 287, area: 92_212 },
  SE: { population: 10_551_000, gdp: 593, area: 450_295 },
  HU: { population: 9_597_000, gdp: 203, area: 93_028 },
  AT: { population: 9_158_000, gdp: 516, area: 83_879 },
  BG: { population: 6_447_000, gdp: 114, area: 110_879 },
  DK: { population: 5_946_000, gdp: 404, area: 42_943 },
  FI: { population: 5_563_000, gdp: 300, area: 338_424 },
  SK: { population: 5_428_000, gdp: 127, area: 49_035 },
  IE: { population: 5_194_000, gdp: 545, area: 70_273 },
  HR: { population: 3_855_000, gdp: 82, area: 56_594 },
  LT: { population: 2_860_000, gdp: 77, area: 65_300 },
  SI: { population: 2_116_000, gdp: 68, area: 20_273 },
  LV: { population: 1_884_000, gdp: 43, area: 64_559 },
  EE: { population: 1_366_000, gdp: 41, area: 45_228 },
  CY: { population: 1_260_000, gdp: 32, area: 9_251 },
  LU: { population: 672_000, gdp: 87, area: 2_586 },
  MT: { population: 542_000, gdp: 20, area: 316 },
};

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
      const [politicians, events, countryData, partyData, jurisdictionData, eventTypeData, enrichmentData, epGroupData, financesData, investmentsData, positionsData] = await Promise.all([
        supabase.from('politicians').select('id', { count: 'exact', head: true }),
        supabase.from('political_events').select('id', { count: 'exact', head: true }),
        supabase.from('politicians').select('country_name, country_code'),
        supabase.from('politicians').select('party_name, country_name'),
        supabase.from('politicians').select('jurisdiction'),
        supabase.from('political_events').select('event_type'),
        supabase.from('politicians').select('enriched_at'),
        supabase.from('politicians').select('party_name').not('party_name', 'is', null),
        supabase.from('politician_finances').select('politician_id, annual_salary, side_income, declared_assets, property_value, salary_source'),
        supabase.from('politician_investments').select('politician_id, company_name, sector, estimated_value, investment_type'),
        supabase.from('politician_positions').select('economic_score, social_score, ideology_label, eu_integration_score, environmental_score, immigration_score, education_priority, science_priority, healthcare_priority, defense_priority, economy_priority, justice_priority, social_welfare_priority, environment_priority'),
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

      // National parties
      const nationalParties: Record<string, { count: number; country: string }> = {};
      (partyData.data || []).forEach((p: any) => {
        const party = p.party_name;
        if (!party) return;
        if (!nationalParties[party]) nationalParties[party] = { count: 0, country: p.country_name };
        nationalParties[party].count++;
      });

      // === Cross-referenced data ===
      // Politicians per million people
      const perCapita = byCountry
        .filter(c => EU_COUNTRY_DATA[c.code])
        .map(c => {
          const ref = EU_COUNTRY_DATA[c.code];
          return {
            name: c.code,
            fullName: c.name,
            count: c.count,
            population: ref.population,
            perMillion: parseFloat(((c.count / ref.population) * 1_000_000).toFixed(1)),
          };
        })
        .sort((a, b) => b.perMillion - a.perMillion);

      // Politicians per $B GDP
      const perGdp = byCountry
        .filter(c => EU_COUNTRY_DATA[c.code])
        .map(c => {
          const ref = EU_COUNTRY_DATA[c.code];
          return {
            name: c.code,
            fullName: c.name,
            count: c.count,
            gdp: ref.gdp,
            perBillion: parseFloat((c.count / ref.gdp).toFixed(2)),
          };
        })
        .sort((a, b) => b.perBillion - a.perBillion);

      // Scatter: GDP vs Politicians (bubble = population)
      const scatterData = byCountry
        .filter(c => EU_COUNTRY_DATA[c.code])
        .map(c => {
          const ref = EU_COUNTRY_DATA[c.code];
          return {
            name: c.code,
            fullName: c.name,
            gdp: ref.gdp,
            politicians: c.count,
            population: ref.population / 1_000_000,
          };
        });

      // Representation index: normalized score combining per-capita and per-GDP
      const maxPerCap = Math.max(...perCapita.map(c => c.perMillion));
      const maxPerGdp = Math.max(...perGdp.map(c => c.perBillion));
      const representationIndex = byCountry
        .filter(c => EU_COUNTRY_DATA[c.code])
        .map(c => {
          const ref = EU_COUNTRY_DATA[c.code];
          const pCap = (c.count / ref.population) * 1_000_000;
          const pGdp = c.count / ref.gdp;
          const pArea = (c.count / ref.area) * 10_000;
          return {
            name: c.code,
            fullName: c.name,
            perCapita: parseFloat(((pCap / maxPerCap) * 100).toFixed(0)),
            perGdp: parseFloat(((pGdp / maxPerGdp) * 100).toFixed(0)),
            density: parseFloat(Math.min(100, pArea * 5).toFixed(0)),
            absolute: parseFloat(((c.count / byCountry[0].count) * 100).toFixed(0)),
          };
        })
        .sort((a, b) => (b.perCapita + b.perGdp) - (a.perCapita + a.perGdp))
        .slice(0, 8);

      // GDP per politician (how much economic output per tracked politician)
      const gdpPerPol = byCountry
        .filter(c => EU_COUNTRY_DATA[c.code] && c.count > 0)
        .map(c => {
          const ref = EU_COUNTRY_DATA[c.code];
          return {
            name: c.code,
            fullName: c.name,
            gdpPerPolitician: parseFloat((ref.gdp / c.count).toFixed(1)),
          };
        })
        .sort((a, b) => b.gdpPerPolitician - a.gdpPerPolitician);

      // === Financial data analysis ===
      const finances = financesData.data || [];
      const invData = investmentsData.data || [];

      // Salary distribution buckets
      const salaryBuckets = [
        { range: '< €80K', min: 0, max: 80000, count: 0 },
        { range: '€80-120K', min: 80000, max: 120000, count: 0 },
        { range: '€120-150K', min: 120000, max: 150000, count: 0 },
        { range: '€150-200K', min: 150000, max: 200000, count: 0 },
        { range: '> €200K', min: 200000, max: Infinity, count: 0 },
      ];
      finances.forEach((f: any) => {
        if (!f.annual_salary) return;
        const bucket = salaryBuckets.find(b => f.annual_salary >= b.min && f.annual_salary < b.max);
        if (bucket) bucket.count++;
      });
      const salaryDistribution = salaryBuckets.map(b => ({ name: b.range, count: b.count }));

      // Investment sectors
      const sectorTotals: Record<string, { value: number; count: number }> = {};
      invData.forEach((inv: any) => {
        const s = inv.sector || 'Other';
        if (!sectorTotals[s]) sectorTotals[s] = { value: 0, count: 0 };
        sectorTotals[s].value += inv.estimated_value || 0;
        sectorTotals[s].count++;
      });
      const bySector = Object.entries(sectorTotals)
        .map(([name, { value, count }]) => ({ name, value: Math.round(value), count }))
        .sort((a, b) => b.value - a.value);

      // Top invested companies
      const companyTotals: Record<string, { value: number; count: number; sector: string }> = {};
      invData.forEach((inv: any) => {
        const c = inv.company_name;
        if (!companyTotals[c]) companyTotals[c] = { value: 0, count: 0, sector: inv.sector || '' };
        companyTotals[c].value += inv.estimated_value || 0;
        companyTotals[c].count++;
      });
      const topCompanies = Object.entries(companyTotals)
        .map(([name, { value, count, sector }]) => ({ name, value: Math.round(value), investors: count, sector }))
        .sort((a, b) => b.investors - a.investors)
        .slice(0, 15);

      // Average salary by source (EP vs National)
      const salaryBySource: Record<string, { total: number; count: number }> = {};
      finances.forEach((f: any) => {
        const src = f.salary_source || 'Unknown';
        if (!salaryBySource[src]) salaryBySource[src] = { total: 0, count: 0 };
        salaryBySource[src].total += f.annual_salary || 0;
        salaryBySource[src].count++;
      });
      const avgSalaryBySource = Object.entries(salaryBySource)
        .map(([name, { total, count }]) => ({ name, avgSalary: Math.round(total / count), count }))
        .sort((a, b) => b.avgSalary - a.avgSalary);

      // Side income stats
      const withSideIncome = finances.filter((f: any) => (f.side_income || 0) > 0);
      const totalInvestmentValue = invData.reduce((s: number, inv: any) => s + (inv.estimated_value || 0), 0);

      // === Political orientation data ===
      const positions = positionsData.data || [];
      
      // Ideology distribution
      const ideologyCounts: Record<string, number> = {};
      positions.forEach((p: any) => {
        const label = p.ideology_label || 'Unknown';
        ideologyCounts[label] = (ideologyCounts[label] || 0) + 1;
      });
      const byIdeology = Object.entries(ideologyCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Economic vs Social scatter (sampled for performance)
      const compassSample = positions
        .filter((_: any, i: number) => i % 3 === 0) // sample every 3rd
        .map((p: any) => ({
          x: Number(p.economic_score),
          y: Number(p.social_score),
          ideology: p.ideology_label || 'Unknown',
        }));

      // Average policy priorities across all politicians
      const avgPriorities = positions.length > 0 ? [
        { domain: 'Education', value: parseFloat((positions.reduce((s: number, p: any) => s + Number(p.education_priority), 0) / positions.length).toFixed(1)) },
        { domain: 'Science', value: parseFloat((positions.reduce((s: number, p: any) => s + Number(p.science_priority), 0) / positions.length).toFixed(1)) },
        { domain: 'Healthcare', value: parseFloat((positions.reduce((s: number, p: any) => s + Number(p.healthcare_priority), 0) / positions.length).toFixed(1)) },
        { domain: 'Defense', value: parseFloat((positions.reduce((s: number, p: any) => s + Number(p.defense_priority), 0) / positions.length).toFixed(1)) },
        { domain: 'Economy', value: parseFloat((positions.reduce((s: number, p: any) => s + Number(p.economy_priority), 0) / positions.length).toFixed(1)) },
        { domain: 'Justice', value: parseFloat((positions.reduce((s: number, p: any) => s + Number(p.justice_priority), 0) / positions.length).toFixed(1)) },
        { domain: 'Social Welfare', value: parseFloat((positions.reduce((s: number, p: any) => s + Number(p.social_welfare_priority), 0) / positions.length).toFixed(1)) },
        { domain: 'Environment', value: parseFloat((positions.reduce((s: number, p: any) => s + Number(p.environment_priority), 0) / positions.length).toFixed(1)) },
      ] : [];

      // EU integration distribution
      const euBuckets = [
        { range: 'Strong Eurosceptic', min: -10, max: -5, count: 0 },
        { range: 'Eurosceptic', min: -5, max: -1, count: 0 },
        { range: 'Neutral', min: -1, max: 1, count: 0 },
        { range: 'Pro-EU', min: 1, max: 5, count: 0 },
        { range: 'Strong Pro-EU', min: 5, max: 10.1, count: 0 },
      ];
      positions.forEach((p: any) => {
        const v = Number(p.eu_integration_score);
        const bucket = euBuckets.find(b => v >= b.min && v < b.max);
        if (bucket) bucket.count++;
      });
      const euDistribution = euBuckets.map(b => ({ name: b.range, count: b.count }));

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
        perCapita,
        perGdp,
        scatterData,
        representationIndex,
        gdpPerPol,
        // Financial
        salaryDistribution,
        bySector,
        topCompanies,
        avgSalaryBySource,
        sideIncomeCount: withSideIncome.length,
        sideIncomePct: finances.length > 0 ? Math.round((withSideIncome.length / finances.length) * 100) : 0,
        totalInvestmentValue,
        totalInvestments: invData.length,
        politiciansWithInvestments: new Set(invData.map((i: any) => i.politician_id)).size,
        // Political orientation
        byIdeology,
        compassSample,
        avgPriorities,
        euDistribution,
        totalPositions: positions.length,
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

const ScatterTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="brutalist-border bg-background p-2 text-xs font-mono space-y-0.5">
      <p className="font-bold">{d?.fullName}</p>
      <p>GDP: ${d?.gdp}B</p>
      <p>Politicians: {d?.politicians}</p>
      <p>Population: {d?.population?.toFixed(1)}M</p>
    </div>
  );
};

const PerCapitaTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="brutalist-border bg-background p-2 text-xs font-mono">
      <p className="font-bold">{d?.fullName || label}</p>
      <p>{payload[0]?.value} per million people</p>
      <p className="text-muted-foreground">{d?.count} politicians / {(d?.population / 1_000_000).toFixed(1)}M pop</p>
    </div>
  );
};

const PerGdpTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="brutalist-border bg-background p-2 text-xs font-mono">
      <p className="font-bold">{d?.fullName || label}</p>
      <p>{payload[0]?.value} per $B GDP</p>
      <p className="text-muted-foreground">{d?.count} politicians / ${d?.gdp}B GDP</p>
    </div>
  );
};

const GdpPerPolTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="brutalist-border bg-background p-2 text-xs font-mono">
      <p className="font-bold">{d?.fullName || label}</p>
      <p>${payload[0]?.value}B GDP per politician</p>
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

        {/* Row 1: Politicians per Country */}
        <section>
          <h2 className="text-lg font-extrabold tracking-tight mb-4 font-mono">POLITICIANS PER COUNTRY</h2>
          <div className="brutalist-border bg-card p-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats.byCountry} margin={{ top: 5, right: 5, left: 5, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="code" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* NEW: Per Capita + Per GDP side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-1 font-mono">POLITICIANS PER MILLION PEOPLE</h2>
            <p className="text-xs font-mono text-muted-foreground mb-4">Political representation density — smaller countries have higher ratios</p>
            <div className="brutalist-border bg-card p-4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.perCapita} margin={{ top: 5, right: 5, left: 5, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<PerCapitaTooltip />} />
                  <Bar dataKey="perMillion" fill="hsl(150, 40%, 40%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-1 font-mono">POLITICIANS PER $B GDP</h2>
            <p className="text-xs font-mono text-muted-foreground mb-4">Political density relative to economic output</p>
            <div className="brutalist-border bg-card p-4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.perGdp} margin={{ top: 5, right: 5, left: 5, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<PerGdpTooltip />} />
                  <Bar dataKey="perBillion" fill="hsl(45, 70%, 50%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* NEW: GDP vs Politicians Scatter */}
        <section>
          <h2 className="text-lg font-extrabold tracking-tight mb-1 font-mono">GDP vs POLITICAL REPRESENTATION</h2>
          <p className="text-xs font-mono text-muted-foreground mb-4">Bubble size = population (millions). Shows whether richer countries have proportionally more tracked politicians</p>
          <div className="brutalist-border bg-card p-4">
            <ResponsiveContainer width="100%" height={420}>
              <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" dataKey="gdp" name="GDP ($B)" tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" label={{ value: 'GDP ($B)', position: 'insideBottom', offset: -5, style: { fontSize: 11, fontFamily: 'monospace' } }} />
                <YAxis type="number" dataKey="politicians" name="Politicians" tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" label={{ value: 'Politicians', angle: -90, position: 'insideLeft', style: { fontSize: 11, fontFamily: 'monospace' } }} />
                <ZAxis type="number" dataKey="population" range={[40, 400]} />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter data={stats.scatterData} fill="hsl(var(--primary))" fillOpacity={0.7} stroke="hsl(var(--primary))" strokeWidth={1} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* NEW: GDP per Politician */}
        <section>
          <h2 className="text-lg font-extrabold tracking-tight mb-1 font-mono">GDP PER TRACKED POLITICIAN ($B)</h2>
          <p className="text-xs font-mono text-muted-foreground mb-4">Economic output per politician — higher means fewer politicians relative to GDP</p>
          <div className="brutalist-border bg-card p-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats.gdpPerPol} margin={{ top: 5, right: 5, left: 5, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<GdpPerPolTooltip />} />
                <Bar dataKey="gdpPerPolitician" fill="hsl(280, 30%, 50%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* NEW: Representation Radar */}
        <section>
          <h2 className="text-lg font-extrabold tracking-tight mb-1 font-mono">REPRESENTATION INDEX — TOP 8 COUNTRIES</h2>
          <p className="text-xs font-mono text-muted-foreground mb-4">Normalized scores across per-capita, per-GDP, density, and absolute count</p>
          <div className="brutalist-border bg-card p-4">
            <ResponsiveContainer width="100%" height={420}>
              <RadarChart data={stats.representationIndex}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'monospace', fill: 'hsl(var(--foreground))' }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                <Radar name="Per Capita" dataKey="perCapita" stroke="hsl(150, 40%, 40%)" fill="hsl(150, 40%, 40%)" fillOpacity={0.15} />
                <Radar name="Per GDP" dataKey="perGdp" stroke="hsl(45, 70%, 50%)" fill="hsl(45, 70%, 50%)" fillOpacity={0.15} />
                <Radar name="Density" dataKey="density" stroke="hsl(280, 30%, 50%)" fill="hsl(280, 30%, 50%)" fillOpacity={0.15} />
                <Radar name="Absolute" dataKey="absolute" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
                <Legend formatter={(v: string) => <span className="text-xs font-mono">{v}</span>} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Row: EP Groups + Jurisdiction */}
        <div className="grid md:grid-cols-2 gap-6">
          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-4 font-mono">EP POLITICAL GROUPS</h2>
            <div className="brutalist-border bg-card p-4">
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={stats.byGroup} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: 'monospace' }} width={80} stroke="hsl(var(--muted-foreground))" />
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
                  <Pie data={jurisdictionWithTotal} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={140} label={renderCustomLabel} labelLine={false}>
                    {jurisdictionWithTotal.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend formatter={(v: string) => <span className="text-xs font-mono">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Event Types + Country table */}
        <div className="grid md:grid-cols-2 gap-6">
          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-4 font-mono">EVENT TYPES</h2>
            <div className="brutalist-border bg-card p-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={eventsWithTotal} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={renderCustomLabel} labelLine={false}>
                    {eventsWithTotal.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend formatter={(v: string) => <span className="text-xs font-mono">{v}</span>} />
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
                      <th className="text-right p-2 font-bold">COUNT</th>
                      <th className="text-right p-2 font-bold">PER 1M</th>
                      <th className="text-left p-2 font-bold w-1/4">DIST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byCountry.map((c, i) => {
                      const ref = EU_COUNTRY_DATA[c.code];
                      const perM = ref ? ((c.count / ref.population) * 1_000_000).toFixed(1) : '—';
                      return (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="p-2">{c.code} {c.name}</td>
                          <td className="p-2 text-right font-bold">{c.count}</td>
                          <td className="p-2 text-right text-muted-foreground">{perM}</td>
                          <td className="p-2">
                            <div className="h-3 bg-muted rounded-sm overflow-hidden">
                              <div className="h-full bg-primary rounded-sm" style={{ width: `${(c.count / stats.byCountry[0].count) * 100}%` }} />
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
        </div>

        {/* EP Groups table */}
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
                            <div className="h-full rounded-sm" style={{ width: `${(g.count / stats.byGroup[0].count) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
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

        {/* === FINANCIAL TRANSPARENCY SECTION === */}
        <div className="brutalist-border-b pb-2 mt-4">
          <h2 className="text-xl font-extrabold tracking-tighter font-mono">💰 FINANCIAL TRANSPARENCY</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Salary, investments, and financial interests across {stats.totalPoliticians} politicians
          </p>
        </div>

        {/* Financial summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Investment Value" value={`€${(stats.totalInvestmentValue / 1_000_000).toFixed(1)}M`} />
          <StatCard label="Disclosed Investments" value={stats.totalInvestments} sub={`${stats.politiciansWithInvestments} politicians`} />
          <StatCard label="With Side Income" value={`${stats.sideIncomePct}%`} sub={`${stats.sideIncomeCount} politicians`} />
          <StatCard label="Investment Sectors" value={stats.bySector.length} />
        </div>

        {/* Salary distribution + Avg salary by source */}
        <div className="grid md:grid-cols-2 gap-6">
          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-1 font-mono">SALARY DISTRIBUTION</h2>
            <p className="text-xs font-mono text-muted-foreground mb-4">How politician salaries are distributed across income brackets</p>
            <div className="brutalist-border bg-card p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.salaryDistribution} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-1 font-mono">AVERAGE SALARY BY SOURCE</h2>
            <p className="text-xs font-mono text-muted-foreground mb-4">EP Parliament vs National Government compensation</p>
            <div className="brutalist-border bg-card p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.avgSalaryBySource} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: 'monospace' }} width={120} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip formatter={(v: number) => `€${v.toLocaleString()}`} />
                  <Bar dataKey="avgSalary" fill="hsl(150, 40%, 40%)" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Investment by sector + Top companies */}
        <div className="grid md:grid-cols-2 gap-6">
          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-1 font-mono">INVESTMENT BY SECTOR</h2>
            <p className="text-xs font-mono text-muted-foreground mb-4">Where politicians put their money — total disclosed value per sector</p>
            <div className="brutalist-border bg-card p-4">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie data={stats.bySector} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={130} innerRadius={50}>
                    {stats.bySector.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `€${(v / 1000).toFixed(0)}K`} />
                  <Legend formatter={(v: string) => <span className="text-xs font-mono">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold tracking-tight mb-1 font-mono">MOST POPULAR INVESTMENTS</h2>
            <p className="text-xs font-mono text-muted-foreground mb-4">Companies with the most politician-investors</p>
            <div className="brutalist-border bg-card overflow-hidden">
              <div className="max-h-[390px] overflow-y-auto">
                <table className="w-full text-xs font-mono">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border">
                      <th className="text-left p-2 font-bold">COMPANY</th>
                      <th className="text-left p-2 font-bold">SECTOR</th>
                      <th className="text-right p-2 font-bold">INVESTORS</th>
                      <th className="text-right p-2 font-bold">TOTAL VALUE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topCompanies.map((c: any, i: number) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="p-2 font-medium">{c.name}</td>
                        <td className="p-2"><span className="px-1.5 py-0.5 rounded text-[10px] bg-muted">{c.sector}</span></td>
                        <td className="p-2 text-right font-bold">{c.investors}</td>
                        <td className="p-2 text-right text-muted-foreground">€{(c.value / 1000).toFixed(0)}K</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Sector holdings bar chart */}
        <section>
          <h2 className="text-lg font-extrabold tracking-tight mb-1 font-mono">HOLDINGS PER SECTOR</h2>
          <p className="text-xs font-mono text-muted-foreground mb-4">Number of individual investment positions by sector</p>
          <div className="brutalist-border bg-card p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.bySector} margin={{ top: 5, right: 5, left: 5, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="hsl(280, 30%, 50%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Data Sources */}
        <section>
          <h2 className="text-lg font-extrabold tracking-tight mb-4 font-mono">DATA SOURCES</h2>
          <div className="grid sm:grid-cols-4 gap-3">
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
              <div className="text-sm font-bold">Financial Disclosures</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">{stats.totalInvestments} positions tracked</div>
              <div className="text-xs text-accent mt-2">Declarations of interest</div>
            </div>
            <div className="brutalist-border p-4 bg-card">
              <div className="text-sm font-bold">Public RSS Feeds</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">{stats.totalEvents} events · EU sources</div>
              <div className="text-xs text-accent mt-2">ec.europa.eu</div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Data;
