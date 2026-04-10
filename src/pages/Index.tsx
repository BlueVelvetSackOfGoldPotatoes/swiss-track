import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SearchBar from '@/components/SearchBar';
import ActorCard from '@/components/ActorCard';
import { usePoliticians, useCountryStats } from '@/hooks/use-politicians';

const Index = () => {
  const { data: actors = [] } = usePoliticians();
  const { data: countryStats = [] } = useCountryStats();
  const totalParties = new Set(countryStats.flatMap(c => c.parties)).size;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div>
            <div className="flex items-baseline justify-between mb-4 brutalist-border-b pb-2">
              <h2 className="text-lg font-extrabold tracking-tight">RECENTLY ADDED</h2>
              <span className="font-mono text-xs text-muted-foreground">
                {actors.length} politicians
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actors.slice(0, 12).map((a) => (
                <ActorCard key={a.id} actor={a} />
              ))}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="brutalist-border p-4 bg-secondary">
              <h3 className="font-mono text-xs font-bold mb-3">PLATFORM STATUS</h3>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Countries tracked</span>
                  <span className="font-bold text-foreground">{countryStats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actors indexed</span>
                  <span className="font-bold text-foreground">{actors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Parties tracked</span>
                  <span className="font-bold text-foreground">{totalParties}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="brutalist-border-b pb-2 mb-4">
                <h2 className="text-sm font-extrabold tracking-tight">COUNTRIES BY COVERAGE</h2>
              </div>
              <div className="space-y-2">
                {countryStats
                  .sort((a, b) => b.actorCount - a.actorCount)
                  .slice(0, 10)
                  .map(c => (
                    <div key={c.code} className="brutalist-border px-3 py-2 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold">{c.code} · {c.name}</span>
                      <span className="evidence-tag">{c.actorCount} actors</span>
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
