import { Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { continents, countries, mockActors, parties, getCountry } from '@/data/mockData';

const Explore = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8">
        <div className="brutalist-border-b pb-2 mb-6">
          <h2 className="text-lg font-extrabold tracking-tight">EXPLORE THE WORLD</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Browse politicians, parties, and proposals by continent, country, and city.
          </p>
        </div>

        {/* Global stats */}
        <div className="brutalist-border p-4 bg-secondary mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="font-mono text-xs text-muted-foreground">COUNTRIES</div>
            <div className="font-mono text-2xl font-bold">{countries.length}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-muted-foreground">ACTORS</div>
            <div className="font-mono text-2xl font-bold">{mockActors.length}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-muted-foreground">PARTIES</div>
            <div className="font-mono text-2xl font-bold">{parties.length}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-muted-foreground">CONTINENTS</div>
            <div className="font-mono text-2xl font-bold">{continents.length}</div>
          </div>
        </div>

        {/* Continents → Countries → Actors */}
        {continents.map(cont => {
          const contCountries = countries.filter(c => c.continentId === cont.id);
          const contActors = mockActors.filter(a => contCountries.some(c => c.id === a.countryId));
          if (contActors.length === 0) return null;

          return (
            <section key={cont.id} className="mb-8">
              <h3 className="text-sm font-extrabold tracking-tight brutalist-border-b pb-2 mb-4">
                {cont.name.toUpperCase()}
                <span className="font-mono text-xs text-muted-foreground ml-2">
                  {contCountries.length} countries · {contActors.length} actors
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contCountries.map(country => {
                  const countryActors = mockActors.filter(a => a.countryId === country.id);
                  if (countryActors.length === 0) return null;

                  return (
                    <div key={country.id} className="brutalist-border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Link to={`/country/${country.id}`} className="font-bold text-sm hover:underline">
                          {country.code} · {country.name}
                        </Link>
                        <span className="evidence-tag">{countryActors.length}</span>
                      </div>
                      <div className="space-y-2">
                        {countryActors.slice(0, 3).map(actor => (
                          <Link
                            key={actor.id}
                            to={`/actors/${actor.id}`}
                            className="block font-mono text-xs hover:bg-secondary px-2 py-1.5 brutalist-border-b last:border-b-0"
                          >
                            <span className="font-bold">{actor.name}</span>
                            <span className="text-muted-foreground ml-2">{actor.party} · {actor.role}</span>
                          </Link>
                        ))}
                        {countryActors.length > 3 && (
                          <Link to={`/country/${country.id}`} className="block text-xs font-mono text-accent hover:underline">
                            +{countryActors.length - 3} more →
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
      <SiteFooter />
    </div>
  );
};

export default Explore;
