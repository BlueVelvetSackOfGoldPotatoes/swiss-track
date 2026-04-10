import { useParams, Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ActorTimeline from '@/components/ActorTimeline';
import ActorCharts from '@/components/ActorCharts';
import { usePolitician, usePoliticianEvents } from '@/hooks/use-politicians';

const ActorDetail = () => {
  const { id } = useParams();
  const { data: actor, isLoading } = usePolitician(id);
  const { data: events = [] } = usePoliticianEvents(id);

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

  const yearsInOffice = actor.inOfficeSince
    ? Math.floor((Date.now() - new Date(actor.inOfficeSince).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8 max-w-4xl">
        <Link to="/actors" className="text-accent underline text-xs font-mono mb-4 inline-block">← ACTORS</Link>

        <div className="brutalist-border-b pb-4 mb-6">
          <div className="flex gap-2 mb-2 flex-wrap">
            <span className="evidence-tag">{actor.countryId.toUpperCase()}</span>
            <span className="evidence-tag">{actor.party}</span>
            <span className="evidence-tag">{actor.jurisdiction.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">{actor.name}</h1>
          <p className="text-sm font-mono text-muted-foreground">{actor.role} · {actor.canton}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          <div>
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

            {events.length === 0 && (
              <div className="brutalist-border p-6 bg-secondary text-center">
                <p className="font-mono text-sm text-muted-foreground">No events tracked yet for this politician.</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">Events will appear here once data is scraped.</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
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

            {actor.topDonors && actor.topDonors.length > 0 && (
              <div className="brutalist-border p-4">
                <h3 className="font-mono text-xs font-bold mb-2">TOP DONORS</h3>
                <div className="space-y-1">
                  {actor.topDonors.map(d => (
                    <div key={d} className="font-mono text-xs bg-secondary px-2 py-1.5 brutalist-border">{d}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="brutalist-border p-4">
              <h3 className="font-mono text-xs font-bold mb-2">TRANSPARENCY</h3>
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span>Total events tracked</span>
                  <span className="font-bold">{events.length}</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span>Sources</span>
                  <span className="font-bold">{new Set(events.map(e => e.source).filter(Boolean)).size}</span>
                </div>
              </div>
            </div>

            <div className="font-mono text-xs text-muted-foreground space-y-1">
              <div>rev: {actor.revisionId}</div>
              <div>updated: {new Date(actor.updatedAt).toLocaleDateString()}</div>
              {actor.birthYear && <div>born: {actor.birthYear}</div>}
              {actor.inOfficeSince && <div>in office since: {new Date(actor.inOfficeSince).toLocaleDateString()}</div>}
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ActorDetail;
