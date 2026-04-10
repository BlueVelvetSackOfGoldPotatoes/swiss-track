import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { SourceBadge } from '@/components/SourceBadge';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8 max-w-3xl">
        <div className="brutalist-border-b pb-2 mb-6">
          <h1 className="text-lg font-extrabold tracking-tight">ABOUT & METHODOLOGY</h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            How this platform collects, processes, and presents political data across the EU.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          {/* What this platform is */}
          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">WHAT THIS PLATFORM IS</h3>
            <div className="brutalist-border p-4 bg-secondary/30">
              <p className="mb-2">
                An open transparency platform that tracks <strong>politicians</strong>, <strong>legislative proposals</strong>,
                <strong> financial interests</strong>, <strong>political associations</strong>, and <strong>voting patterns</strong> across
                the European Union and its member states.
              </p>
              <p>
                Every piece of data is linked to its source through provenance badges. The platform covers the European Parliament
                and national parliaments including Germany, France, Italy, Spain, the Netherlands, Poland, and 12+ additional EU countries.
              </p>
            </div>
          </section>

          {/* Coverage */}
          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">COVERAGE</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="brutalist-border p-3">
                <div className="font-mono text-xs font-bold mb-1">POLITICIANS</div>
                <p className="text-xs text-muted-foreground">
                  Members of the European Parliament (MEPs) and national parliament members across 18+ EU countries.
                  Each profile includes biography, party affiliation, committee memberships, political orientation scores,
                  financial declarations, investment portfolios, and close associates.
                </p>
              </div>
              <div className="brutalist-border p-3">
                <div className="font-mono text-xs font-bold mb-1">LEGISLATIVE PROPOSALS</div>
                <p className="text-xs text-muted-foreground">
                  Bills, resolutions, directives, and regulations tracked from submission through committee review to
                  final vote. Includes sponsors, policy area classification, affected laws, and official source links.
                </p>
              </div>
              <div className="brutalist-border p-3">
                <div className="font-mono text-xs font-bold mb-1">POLITICAL ORIENTATION</div>
                <p className="text-xs text-muted-foreground">
                  Multi-dimensional mapping using economic/social axes, policy priority radar charts, EU integration scores,
                  environmental scores, and immigration stance. Based on Chapel Hill Expert Survey methodology and party family mapping.
                </p>
              </div>
              <div className="brutalist-border p-3">
                <div className="font-mono text-xs font-bold mb-1">FINANCIAL TRANSPARENCY</div>
                <p className="text-xs text-muted-foreground">
                  Annual salaries, side income, declared assets, property values, and investment portfolios with sector breakdowns.
                  Sourced from official parliamentary declarations and transparency registers.
                </p>
              </div>
              <div className="brutalist-border p-3">
                <div className="font-mono text-xs font-bold mb-1">RELATIONSHIPS & NETWORKS</div>
                <p className="text-xs text-muted-foreground">
                  Domestic and international associate networks including party allies, coalition partners, committee peers,
                  and cross-border connections. Visualized through ideological clusters, connection graphs, and hierarchical trees.
                </p>
              </div>
              <div className="brutalist-border p-3">
                <div className="font-mono text-xs font-bold mb-1">DATA OBSERVATORY</div>
                <p className="text-xs text-muted-foreground">
                  Cross-referencing politician data with national metrics (GDP, population), legislative activity heatmaps,
                  proposal analytics by country/status/policy area, and comparative visualizations.
                </p>
              </div>
            </div>
          </section>

          {/* Data Sources */}
          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">DATA SOURCES</h3>
            <div className="brutalist-border">
              <div className="px-3 py-2 brutalist-border-b bg-secondary font-mono text-xs font-bold">
                TIER 1 — Official / Primary Institutional
              </div>
              <div className="px-3 py-2 brutalist-border-b text-sm space-y-1">
                <p>European Parliament API &amp; XML directories, EUR-Lex legislation database, national parliamentary APIs
                  (Bundestag, Assemblée nationale, Camera dei Deputati, Congreso de los Diputados, Tweede Kamer, Sejm, etc.),
                  Wikipedia (biographies, infoboxes, images), official government gazettes.</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <SourceBadge label="European Parliament" url="https://www.europarl.europa.eu/" type="official" />
                  <SourceBadge label="EUR-Lex" url="https://eur-lex.europa.eu/" type="official" />
                  <SourceBadge label="Wikipedia" url="https://en.wikipedia.org/" type="official" />
                </div>
              </div>
              <div className="px-3 py-2 brutalist-border-b bg-secondary font-mono text-xs font-bold">
                TIER 2 — Expert Surveys & Research
              </div>
              <div className="px-3 py-2 brutalist-border-b text-sm space-y-1">
                <p>Chapel Hill Expert Survey (CHES) for political orientation mapping, OECD governance data,
                  EU transparency register for lobbying and financial interests.</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <SourceBadge label="Chapel Hill Expert Survey" url="https://www.chesdata.eu/" type="model" />
                  <SourceBadge label="EP Transparency Register" url="https://www.europarl.europa.eu/meps/en/declarations" type="official" />
                </div>
              </div>
              <div className="px-3 py-2 brutalist-border-b bg-secondary font-mono text-xs font-bold">
                TIER 3 — High-Quality Secondary
              </div>
              <div className="px-3 py-2 brutalist-border-b text-sm">
                Established news organizations, expert commentary, think-tank analyses with disclosed methodology.
              </div>
              <div className="px-3 py-2 bg-secondary font-mono text-xs font-bold">
                TIER 4 — Model-Generated Synthesis
              </div>
              <div className="px-3 py-2 text-sm">
                Platform-generated political orientation estimates, ideology mapping, and association strength calculations.
                Always labelled with <SourceBadge label="model" type="model" /> or <SourceBadge label="estimate" type="estimate" /> badges.
              </div>
            </div>
          </section>

          {/* Data Pipeline */}
          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">DATA PIPELINE</h3>
            <div className="brutalist-border p-4 bg-secondary/30 space-y-2">
              <p><strong>1. Ingestion</strong> — Automated scrapers (backend functions) pull data from EU Parliament XML directories,
                national parliament Wikipedia categories, and public RSS feeds on a scheduled basis.</p>
              <p><strong>2. Enrichment</strong> — Each politician record is automatically enriched via Wikipedia API to fetch
                biographies, structured infobox data, images, and descriptions.</p>
              <p><strong>3. Political Mapping</strong> — Party affiliations are mapped to ideology families and scored on
                economic, social, environmental, EU integration, and immigration axes using Chapel Hill Expert Survey methodology.</p>
              <p><strong>4. Association Analysis</strong> — Connections between politicians are derived from party membership,
                committee co-membership, EP group affiliation, and coalition partnerships.</p>
              <p><strong>5. Provenance Tagging</strong> — Every data point receives source badges indicating whether it comes from
                official records, expert surveys, model estimates, or platform aggregation.</p>
            </div>
          </section>

          {/* Evidence classification */}
          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">PROVENANCE CLASSIFICATION</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <SourceBadge label="Official" type="official" />
                <span>Directly from an official institutional source (parliament API, government gazette, Wikipedia).</span>
              </div>
              <div className="flex items-center gap-3">
                <SourceBadge label="Fact" type="fact" />
                <span>Verifiable data point traceable to a primary source or public record.</span>
              </div>
              <div className="flex items-center gap-3">
                <SourceBadge label="Model" type="model" />
                <span>Derived from expert survey methodology or algorithmic mapping (e.g., CHES scores).</span>
              </div>
              <div className="flex items-center gap-3">
                <SourceBadge label="Estimate" type="estimate" />
                <span>Inferred from multiple sources, party family mapping, or aggregated data patterns.</span>
              </div>
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">PLATFORM FEATURES</h3>
            <div className="brutalist-border p-4 space-y-2 font-mono text-xs">
              <div className="flex gap-2"><span className="text-primary">✓</span> Politician profiles with biography, committees, financial data, and political compass</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Multi-dimensional political orientation (economic, social, EU integration, environment, immigration)</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Political compass with ideology reference lines and party family coloring</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Policy priority radar charts for each politician</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Close associates network (domestic + international)</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Financial transparency: salary, side income, assets, investment portfolios</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Legislative tracker: proposals, bills, directives across EU + national level</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Relationship explorer: ideological clusters, cross-border connections, hierarchy tree</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Data Observatory with comparative analytics and legislative heatmaps</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Country-level profiles with politician lists and legislative activity</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Full-text search across politicians and proposals</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Source provenance badges on every data section</div>
              <div className="flex gap-2"><span className="text-primary">✓</span> Automated data ingestion via EU Parliament and Wikipedia scrapers</div>
            </div>
          </section>

          {/* Correction policy */}
          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">CORRECTION POLICY</h3>
            <p>
              Every correction creates a new revision with a machine-readable reason code,
              a human-readable correction note, and a link to the superseded revision.
              All corrections are visible in the public provenance log on each politician's profile.
            </p>
          </section>

          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">WHAT THIS PLATFORM DOES NOT DO</h3>
            <ul className="space-y-1 font-mono text-xs">
              <li>× Does not cast ballots or integrate with e-voting systems</li>
              <li>× Does not recommend candidates or parties</li>
              <li>× Does not rank actors by ideology — only maps their positions</li>
              <li>× Does not host user comments or debate</li>
              <li>× Does not generate claims without source provenance</li>
              <li>× Does not store or process personal user data</li>
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default About;
