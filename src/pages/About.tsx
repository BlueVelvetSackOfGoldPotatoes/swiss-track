import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8 max-w-3xl">
        <div className="brutalist-border-b pb-2 mb-6">
          <h2 className="text-lg font-extrabold tracking-tight">METHODOLOGY</h2>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">SOURCE HIERARCHY</h3>
            <div className="brutalist-border">
              <div className="px-3 py-2 brutalist-border-b bg-secondary font-mono text-xs font-bold">
                TIER 1 — Official / Primary Institutional
              </div>
              <div className="px-3 py-2 brutalist-border-b text-sm">
                Fedlex, Swiss Parliament API, opendata.swiss, cantonal gazettes, Federal Chancellery publications.
              </div>
              <div className="px-3 py-2 brutalist-border-b bg-secondary font-mono text-xs font-bold">
                TIER 2 — Primary External Evidence
              </div>
              <div className="px-3 py-2 brutalist-border-b text-sm">
                Peer-reviewed papers, official reports from OECD/EU/international bodies, published datasets.
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
                Platform-generated explainers, scenario analyses, and forecasts. Always labelled. Always linked to source packets.
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">EVIDENCE CLASSIFICATION</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="evidence-fact">FACT</span>
                <span>Directly traceable to an official or primary source.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="evidence-inference">INFERENCE</span>
                <span>Derived from multiple sources or structured reasoning.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="evidence-forecast">FORECAST</span>
                <span>Scenario output with assumptions and uncertainty.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="evidence-unknown">UNKNOWN</span>
                <span>Missing, weak, or conflicting evidence.</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">CORRECTION POLICY</h3>
            <p>
              Every correction creates a new revision with a machine-readable reason code,
              a human-readable correction note, and a link to the superseded revision.
              All corrections are visible in the public changelog.
            </p>
          </section>

          <section>
            <h3 className="font-mono text-xs font-bold text-muted-foreground mb-2">WHAT THIS PLATFORM DOES NOT DO</h3>
            <ul className="space-y-1 font-mono text-xs">
              <li>× Does not cast ballots or integrate with e-voting systems</li>
              <li>× Does not recommend candidates or parties</li>
              <li>× Does not rank actors by ideology</li>
              <li>× Does not host user comments or debate</li>
              <li>× Does not generate claims without evidence packets</li>
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default About;
