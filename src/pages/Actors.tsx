import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ActorCard from '@/components/ActorCard';
import { mockActors, countries } from '@/data/mockData';

const Actors = () => {
  const [countryFilter, setCountryFilter] = useState<string>('all');

  const filtered = countryFilter === 'all'
    ? mockActors
    : mockActors.filter(a => a.countryId === countryFilter);

  const activeCountries = [...new Set(mockActors.map(a => a.countryId))];

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

        {/* Country filter */}
        <div className="flex flex-wrap gap-1 mb-6">
          <button
            onClick={() => setCountryFilter('all')}
            className={`evidence-tag text-xs cursor-pointer ${countryFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}`}
          >
            ALL ({mockActors.length})
          </button>
          {activeCountries.map(cId => {
            const c = countries.find(x => x.id === cId);
            const count = mockActors.filter(a => a.countryId === cId).length;
            return (
              <button
                key={cId}
                onClick={() => setCountryFilter(cId)}
                className={`evidence-tag text-xs cursor-pointer ${countryFilter === cId ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {c?.code} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <ActorCard key={a.id} actor={a} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Actors;
