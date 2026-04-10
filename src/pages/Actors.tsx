import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ActorCard from '@/components/ActorCard';
import { usePoliticians } from '@/hooks/use-politicians';

const Actors = () => {
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const { data: actors = [], isLoading } = usePoliticians();

  const filtered = countryFilter === 'all'
    ? actors
    : actors.filter(a => a.countryId === countryFilter);

  const countryCounts = actors.reduce<Record<string, { code: string; count: number }>>((acc, a) => {
    if (!acc[a.countryId]) acc[a.countryId] = { code: a.countryId.toUpperCase(), count: 0 };
    acc[a.countryId].count++;
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8">
        <div className="brutalist-border-b pb-2 mb-6">
          <h2 className="text-lg font-extrabold tracking-tight">ALL ACTORS</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Politicians, parties, committees, and institutions worldwide.
          </p>
        </div>

        {isLoading ? (
          <div className="font-mono text-sm text-muted-foreground">Loading politicians...</div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
              <div className="flex gap-1 min-w-max sm:flex-wrap sm:min-w-0">
                <button
                  onClick={() => setCountryFilter('all')}
                  className={`evidence-tag text-xs cursor-pointer whitespace-nowrap ${countryFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  ALL ({actors.length})
                </button>
                {Object.entries(countryCounts)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .map(([id, { code, count }]) => (
                    <button
                      key={id}
                      onClick={() => setCountryFilter(id)}
                      className={`evidence-tag text-xs cursor-pointer whitespace-nowrap ${countryFilter === id ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      {code} ({count})
                    </button>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((a) => (
                <ActorCard key={a.id} actor={a} />
              ))}
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default Actors;
