import { useParams, Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { mockActors } from '@/data/mockData';

const ActorDetail = () => {
  const { id } = useParams();
  const actor = mockActors.find((a) => a.id === id);

  if (!actor) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container flex-1 py-8">
          <p className="font-mono text-sm text-muted-foreground">Actor not found.</p>
          <Link to="/actors" className="text-accent underline text-sm mt-2 inline-block">
            ← Back to actors
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8 max-w-3xl">
        <Link to="/actors" className="text-accent underline text-xs font-mono mb-4 inline-block">
          ← ACTORS
        </Link>

        <div className="brutalist-border-b pb-4 mb-6">
          <div className="flex gap-2 mb-2">
            <span className="evidence-tag">{actor.jurisdiction.slice(0, 3).toUpperCase()}</span>
            <span className="evidence-tag">{actor.party}</span>
            <span className="evidence-tag">{actor.canton}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">{actor.name}</h1>
          <p className="text-sm font-mono text-muted-foreground">{actor.role}</p>
        </div>

        {/* Committees */}
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold text-muted-foreground mb-2">COMMITTEE MEMBERSHIPS</h2>
          <div className="space-y-1">
            {actor.committees.map((c) => (
              <div key={c} className="font-mono text-sm brutalist-border px-3 py-1.5 bg-secondary">
                {c}
              </div>
            ))}
          </div>
        </section>

        {/* Recent votes */}
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold text-muted-foreground mb-2">RECENT VOTES</h2>
          <div className="brutalist-border">
            <div className="grid grid-cols-[100px_1fr_80px] font-mono text-xs font-bold bg-secondary px-3 py-2 brutalist-border-b">
              <span>DATE</span>
              <span>PROPOSAL</span>
              <span className="text-right">VOTE</span>
            </div>
            {actor.recentVotes.map((v, i) => (
              <div
                key={i}
                className="grid grid-cols-[100px_1fr_80px] font-mono text-xs px-3 py-2 table-row-alt brutalist-border-b last:border-b-0"
              >
                <span className="text-muted-foreground">{v.date}</span>
                <span>{v.proposal}</span>
                <span className={`text-right font-bold ${
                  v.vote === 'yes' ? 'text-success' : v.vote === 'no' ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {v.vote.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Revision info */}
        <section className="brutalist-border-t pt-4 mt-8">
          <div className="font-mono text-xs text-muted-foreground flex flex-wrap gap-4">
            <span>revision: {actor.revisionId}</span>
            <span>updated: {new Date(actor.updatedAt).toLocaleDateString('de-CH')}</span>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ActorDetail;
