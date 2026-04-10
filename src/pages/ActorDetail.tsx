import { useParams, Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ActorTimeline from '@/components/ActorTimeline';
import ActorCharts from '@/components/ActorCharts';
import { usePolitician, usePoliticianEvents, usePoliticianFinances, usePoliticianInvestments, usePoliticianPosition, useAllPositions, usePoliticianAssociates } from '@/hooks/use-politicians';
import { ExternalLink, TrendingUp, Building2, Briefcase, DollarSign, Compass, Users, Globe, Handshake } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PoliticalCompassChart, IdeologyLegend } from '@/components/PoliticalCompass';
import { PolicyRadarChart, PoliticalAxesBar, KeyPositionsList } from '@/components/PolicyRadar';
import { Link as RouterLink } from 'react-router-dom';

const SECTOR_COLORS: Record<string, string> = {
  Technology: 'hsl(215, 30%, 45%)',
  Energy: 'hsl(45, 70%, 50%)',
  Finance: 'hsl(150, 40%, 40%)',
  Healthcare: 'hsl(0, 55%, 45%)',
  'Real Estate': 'hsl(280, 30%, 50%)',
  Defense: 'hsl(30, 60%, 50%)',
  Consulting: 'hsl(180, 40%, 40%)',
};

function formatCurrency(value: number | null, currency = 'EUR') {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

const ActorDetail = () => {
  const { id } = useParams();
  const { data: actor, isLoading } = usePolitician(id);
  const { data: events = [] } = usePoliticianEvents(id);
  const { data: finances } = usePoliticianFinances(id);
  const { data: investments = [] } = usePoliticianInvestments(id);
  const { data: position } = usePoliticianPosition(id);
  const { data: allPositions = [] } = useAllPositions();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container flex-1 py-8">
          <p className="font-mono text-sm text-muted-foreground">Loading...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container flex-1 py-8">
          <p className="font-mono text-sm text-muted-foreground">Actor not found.</p>
          <Link to="/actors" className="text-accent underline text-sm mt-2 inline-block">← Back to actors</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const infobox = actor.wikipediaData?.infobox as Record<string, string> | undefined;
  const totalInvestmentValue = investments.reduce((s, i) => s + (i.estimated_value || 0), 0);
  const totalIncome = (finances?.annual_salary || 0) + (finances?.side_income || 0);

  // Sector breakdown for pie chart
  const sectorMap: Record<string, number> = {};
  investments.forEach(inv => {
    const sector = inv.sector || 'Other';
    sectorMap[sector] = (sectorMap[sector] || 0) + (inv.estimated_value || 0);
  });
  const sectorData = Object.entries(sectorMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8 max-w-4xl">
        <Link to="/actors" className="text-accent underline text-xs font-mono mb-4 inline-block">← ACTORS</Link>

        {/* Header with photo */}
        <div className="brutalist-border-b pb-4 mb-6">
          <div className="flex gap-4 items-start">
            {actor.photoUrl && (
              <img
                src={actor.photoUrl}
                alt={actor.name}
                className="w-20 h-20 rounded object-cover brutalist-border flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div className="flex-1">
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="evidence-tag">{actor.countryId.toUpperCase()}</span>
                <span className="evidence-tag">{actor.party}</span>
                <span className="evidence-tag">{actor.jurisdiction.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">{actor.name}</h1>
              <p className="text-sm font-mono text-muted-foreground">{actor.role} · {actor.canton}</p>
              {actor.wikipediaData?.description && (
                <p className="text-xs text-muted-foreground mt-1 italic">{actor.wikipediaData.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          <div>
            {/* Wikipedia biography */}
            {actor.wikipediaSummary && (
              <section className="mb-8">
                <h2 className="text-xs font-mono font-bold text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-primary" />
                  BIOGRAPHY
                </h2>
                <div className="brutalist-border p-4 bg-secondary/30">
                  <p className="text-sm leading-relaxed">{actor.wikipediaSummary}</p>
                  {actor.wikipediaUrl && (
                    <a href={actor.wikipediaUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-accent hover:underline mt-3">
                      <ExternalLink className="w-3 h-3" /> Read full article on Wikipedia
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Political Orientation */}
            {position && (
              <section className="mb-8">
                <h2 className="text-xs font-mono font-bold text-muted-foreground mb-3 flex items-center gap-2">
                  <Compass className="w-3 h-3" />
                  POLITICAL ORIENTATION
                  {position.ideology_label && (
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px]">{position.ideology_label}</span>
                  )}
                </h2>

                {/* Political Axes */}
                <div className="brutalist-border p-4 bg-secondary/30 mb-4">
                  <PoliticalAxesBar position={position as any} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Policy Radar */}
                  <div className="brutalist-border p-3 bg-card">
                    <p className="text-[10px] font-mono font-bold text-muted-foreground text-center mb-1">POLICY PRIORITIES</p>
                    <PolicyRadarChart position={position as any} height={250} />
                  </div>

                  {/* Compass position in context */}
                  <div className="brutalist-border p-3 bg-card">
                    <p className="text-[10px] font-mono font-bold text-muted-foreground text-center mb-1">POLITICAL COMPASS</p>
                    <PoliticalCompassChart
                      positions={allPositions}
                      highlightId={id}
                      height={250}
                    />
                  </div>
                </div>

                {/* Key policy positions */}
                {position.key_positions && Object.keys(position.key_positions).length > 0 && (
                  <div className="brutalist-border p-4 bg-card">
                    <p className="text-[10px] font-mono font-bold text-muted-foreground mb-2">KEY POLICY STANCES</p>
                    <KeyPositionsList positions={position.key_positions as Record<string, string>} />
                  </div>
                )}

                <IdeologyLegend />
              </section>
            )}

            {/* Financial Overview */}
            {finances && (
              <section className="mb-8">
                <h2 className="text-xs font-mono font-bold text-muted-foreground mb-3 flex items-center gap-2">
                  <DollarSign className="w-3 h-3" />
                  FINANCIAL OVERVIEW ({finances.declaration_year})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="brutalist-border p-3 bg-card">
                    <div className="text-lg font-extrabold tracking-tighter">{formatCurrency(finances.annual_salary)}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">Annual Salary</div>
                  </div>
                  <div className="brutalist-border p-3 bg-card">
                    <div className="text-lg font-extrabold tracking-tighter">{formatCurrency(finances.side_income)}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">Side Income</div>
                  </div>
                  <div className="brutalist-border p-3 bg-card">
                    <div className="text-lg font-extrabold tracking-tighter">{formatCurrency(finances.declared_assets)}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">Declared Assets</div>
                  </div>
                  <div className="brutalist-border p-3 bg-card">
                    <div className="text-lg font-extrabold tracking-tighter">{formatCurrency(finances.property_value)}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">Property</div>
                  </div>
                </div>
                {finances.salary_source && (
                  <p className="text-xs font-mono text-muted-foreground">Source: {finances.salary_source}</p>
                )}
              </section>
            )}

            {/* Investment Portfolio */}
            {investments.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-mono font-bold text-muted-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  INVESTMENT PORTFOLIO · {investments.length} holdings · {formatCurrency(totalInvestmentValue)}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4">
                  <div className="brutalist-border bg-card overflow-hidden">
                    <div className="max-h-[300px] overflow-y-auto">
                      <table className="w-full text-xs font-mono">
                        <thead className="sticky top-0 bg-card">
                          <tr className="border-b border-border">
                            <th className="text-left p-2 font-bold">COMPANY</th>
                            <th className="text-left p-2 font-bold">SECTOR</th>
                            <th className="text-right p-2 font-bold">VALUE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {investments.map(inv => (
                            <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/50">
                              <td className="p-2 font-medium flex items-center gap-1.5">
                                <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                {inv.company_name}
                              </td>
                              <td className="p-2">
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-muted">{inv.sector || '—'}</span>
                              </td>
                              <td className="p-2 text-right font-bold">{formatCurrency(inv.estimated_value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {sectorData.length > 1 && (
                    <div className="brutalist-border bg-card p-2">
                      <p className="text-[10px] font-mono font-bold text-muted-foreground text-center mb-1">BY SECTOR</p>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={sectorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={30}>
                            {sectorData.map((s, i) => (
                              <Cell key={i} fill={SECTOR_COLORS[s.name] || `hsl(${i * 60}, 40%, 45%)`} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v: number) => formatCurrency(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-1 px-1">
                        {sectorData.map((s, i) => (
                          <div key={s.name} className="flex items-center gap-1.5 text-[10px] font-mono">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: SECTOR_COLORS[s.name] || `hsl(${i * 60}, 40%, 45%)` }} />
                            <span className="truncate">{s.name}</span>
                            <span className="ml-auto text-muted-foreground">{((s.value / totalInvestmentValue) * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {events.length > 0 && (
              <>
                <section className="mb-8">
                  <h2 className="text-xs font-mono font-bold text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-accent" />
                    ANALYTICS
                  </h2>
                  <ActorCharts events={events} />
                </section>
                <section className="mb-8">
                  <h2 className="text-xs font-mono font-bold text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-primary" />
                    PROVENANCE LOG
                  </h2>
                  <ActorTimeline events={events} />
                </section>
              </>
            )}

            {events.length === 0 && !actor.wikipediaSummary && !finances && (
              <div className="brutalist-border p-6 bg-secondary text-center">
                <p className="font-mono text-sm text-muted-foreground">No events tracked yet for this politician.</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {/* Income summary card */}
            {finances && totalIncome > 0 && (
              <div className="brutalist-border p-4 bg-accent/5">
                <h3 className="font-mono text-xs font-bold mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3" /> INCOME SUMMARY
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span>Salary</span>
                    <span className="font-bold">{formatCurrency(finances.annual_salary)}</span>
                  </div>
                  {(finances.side_income || 0) > 0 && (
                    <div className="flex justify-between font-mono text-xs">
                      <span>Side income</span>
                      <span className="font-bold">{formatCurrency(finances.side_income)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-1 flex justify-between font-mono text-xs">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">{formatCurrency(totalIncome)}</span>
                  </div>
                  {investments.length > 0 && (
                    <div className="flex justify-between font-mono text-xs text-muted-foreground">
                      <span>Investment portfolio</span>
                      <span>{formatCurrency(totalInvestmentValue)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Infobox from Wikipedia */}
            {infobox && Object.keys(infobox).length > 0 && (
              <div className="brutalist-border p-4">
                <h3 className="font-mono text-xs font-bold mb-2">DETAILS</h3>
                <div className="space-y-1.5">
                  {Object.entries(infobox).map(([key, val]) => (
                    <div key={key} className="flex justify-between gap-2 font-mono text-xs">
                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-medium text-right max-w-[160px] truncate" title={val}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {actor.committees.length > 0 && (
              <div className="brutalist-border p-4">
                <h3 className="font-mono text-xs font-bold mb-2">COMMITTEES</h3>
                <div className="space-y-1">
                  {actor.committees.map((c) => (
                    <div key={c} className="font-mono text-xs bg-secondary px-2 py-1.5 brutalist-border">{c}</div>
                  ))}
                </div>
              </div>
            )}

            {actor.twitterHandle && (
              <div className="brutalist-border p-4">
                <h3 className="font-mono text-xs font-bold mb-2">SOCIAL MEDIA</h3>
                <div className="font-mono text-sm text-sky-600 dark:text-sky-400">{actor.twitterHandle}</div>
              </div>
            )}

            <div className="brutalist-border p-4">
              <h3 className="font-mono text-xs font-bold mb-2">TRANSPARENCY</h3>
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span>Events tracked</span>
                  <span className="font-bold">{events.length}</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span>Investments disclosed</span>
                  <span className="font-bold">{investments.length}</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span>Wikipedia enriched</span>
                  <span className="font-bold">{actor.enrichedAt ? '✓' : '—'}</span>
                </div>
              </div>
            </div>

            <div className="font-mono text-xs text-muted-foreground space-y-1">
              <div>rev: {actor.revisionId}</div>
              <div>updated: {new Date(actor.updatedAt).toLocaleDateString()}</div>
              {actor.birthYear && <div>born: {actor.birthYear}</div>}
              {actor.inOfficeSince && <div>in office since: {new Date(actor.inOfficeSince).toLocaleDateString()}</div>}
              {actor.enrichedAt && <div>enriched: {new Date(actor.enrichedAt).toLocaleDateString()}</div>}
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ActorDetail;
