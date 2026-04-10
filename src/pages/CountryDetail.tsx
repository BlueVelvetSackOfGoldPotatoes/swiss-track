import { useParams, Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ActorCard from '@/components/ActorCard';
import { usePoliticiansByCountry } from '@/hooks/use-politicians';

const CountryDetail = () => {
  const { id } = useParams();
  const { data: actors = [], isLoading } = usePoliticiansByCountry(id);

  const countryName = actors[0]?.canton || id?.toUpperCase() || 'Unknown';
  const parties = Array.from(new Set(actors.map(a => a.party))).filter(Boolean);

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

  if (actors.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container flex-1 py-8">
          <p className="font-mono text-sm text-muted-foreground">No politicians found for this country.</p>
          <Link to="/explore" className="text-accent underline text-sm mt-2 inline-block">← Back to explore</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8 max-w-4xl">
        <Link to="/explore" className="text-accent underline text-xs font-mono mb-4 inline-block">← EXPLORE</Link>

        <div className="brutalist-border-b pb-4 mb-6">
          <div className="flex gap-2 mb-2">
            <span className="evidence-tag">{id?.toUpperCase()}</span>
            <span className="evidence-tag">Europe</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">{countryName}</h1>
        </div>

        <div className="brutalist-border p-4 bg-secondary mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <div className="font-mono text-xs text-muted-foreground">ACTORS</div>
            <div className="font-mono text-lg font-bold">{actors.length}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-muted-foreground">PARTIES</div>
            <div className="font-mono text-lg font-bold">{parties.length}</div>
          </div>
        </div>

        {parties.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-mono font-bold text-muted-foreground mb-2">PARTIES</h2>
            <div className="flex flex-wrap gap-2">
              {parties.map(p => (
                <div key={p} className="brutalist-border px-3 py-2 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold">{p}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold text-muted-foreground mb-2">ACTORS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actors.map(a => <ActorCard key={a.id} actor={a} />)}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CountryDetail;
