import { useParams, Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ActorCard from '@/components/ActorCard';
import { countries, continents, cities, mockActors, mockProposals, parties } from '@/data/mockData';

const CountryDetail = () => {
  const { id } = useParams();
  const country = countries.find(c => c.id === id);

  if (!country) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container flex-1 py-8">
          <p className="font-mono text-sm text-muted-foreground">Country not found.</p>
          <Link to="/explore" className="text-accent underline text-sm mt-2 inline-block">← Back to explore</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const continent = continents.find(c => c.id === country.continentId);
  const countryCities = cities.filter(c => c.countryId === country.id);
  const countryActors = mockActors.filter(a => a.countryId === country.id);
  const countryProposals = mockProposals.filter(p => p.countryId === country.id);
  const countryParties = parties.filter(p => p.countryId === country.id);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8 max-w-4xl">
        <Link to="/explore" className="text-accent underline text-xs font-mono mb-4 inline-block">← EXPLORE</Link>

        <div className="brutalist-border-b pb-4 mb-6">
          <div className="flex gap-2 mb-2">
            <span className="evidence-tag">{country.code}</span>
            <span className="evidence-tag">{continent?.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">{country.name}</h1>
        </div>

        {/* Stats */}
        <div className="brutalist-border p-4 bg-secondary mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="font-mono text-xs text-muted-foreground">ACTORS</div>
            <div className="font-mono text-lg font-bold">{countryActors.length}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-muted-foreground">PARTIES</div>
            <div className="font-mono text-lg font-bold">{countryParties.length}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-muted-foreground">PROPOSALS</div>
            <div className="font-mono text-lg font-bold">{countryProposals.length}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-muted-foreground">CITIES</div>
            <div className="font-mono text-lg font-bold">{countryCities.length}</div>
          </div>
        </div>

        {/* Parties */}
        {countryParties.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-mono font-bold text-muted-foreground mb-2">PARTIES</h2>
            <div className="flex flex-wrap gap-2">
              {countryParties.map(p => (
                <div key={p.id} className="brutalist-border px-3 py-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="font-mono text-xs font-bold">{p.abbreviation}</span>
                  <span className="font-mono text-xs text-muted-foreground">{p.ideology}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Actors */}
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold text-muted-foreground mb-2">ACTORS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {countryActors.map(a => <ActorCard key={a.id} actor={a} />)}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CountryDetail;
