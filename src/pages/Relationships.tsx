import { useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { relationships, mockActors, parties, partyFamilies, countries, getCountry } from '@/data/mockData';

type ViewMode = 'clusters' | 'connections' | 'tree';

const Relationships = () => {
  const [view, setView] = useState<ViewMode>('clusters');

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8">
        <div className="brutalist-border-b pb-2 mb-6">
          <h2 className="text-lg font-extrabold tracking-tight">RELATIONSHIPS</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Explore connections between politicians, parties, and countries.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex gap-0 mb-6">
          {(['clusters', 'connections', 'tree'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 brutalist-border font-mono text-xs transition-colors ${
                view === v ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              }`}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>

        {view === 'clusters' && <ClustersView />}
        {view === 'connections' && <ConnectionsView />}
        {view === 'tree' && <TreeView />}
      </main>
      <SiteFooter />
    </div>
  );
};

const ClustersView = () => {
  const families = Object.entries(partyFamilies);

  return (
    <div className="space-y-6">
      <p className="font-mono text-xs text-muted-foreground mb-4">
        Parties grouped by ideological family across countries.
      </p>
      {families.map(([famId, famName]) => {
        const familyParties = parties.filter(p => p.familyId === famId);
        if (familyParties.length === 0) return null;

        return (
          <div key={famId} className="brutalist-border p-4">
            <h3 className="font-extrabold text-sm mb-3">{famName.toUpperCase()}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {familyParties.map(party => {
                const country = getCountry(party.countryId);
                const partyActors = mockActors.filter(a => a.partyId === party.id);
                return (
                  <div key={party.id} className="brutalist-border p-3 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: party.color }} />
                      <span className="font-mono text-sm font-bold">{party.abbreviation}</span>
                      <span className="evidence-tag text-xs">{country?.code}</span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mb-2">{party.name}</p>
                    {partyActors.length > 0 && (
                      <div className="space-y-1">
                        {partyActors.map(a => (
                          <Link key={a.id} to={`/actors/${a.id}`} className="block font-mono text-xs hover:underline">
                            → {a.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cross-party alignment lines */}
            {familyParties.length > 1 && (
              <div className="mt-3 brutalist-border-t pt-2">
                <div className="font-mono text-xs text-muted-foreground">
                  Ideological cluster: {familyParties.map(p => p.abbreviation).join(' ↔ ')}
                </div>
                {relationships
                  .filter(r =>
                    r.type === 'ideological_alignment' &&
                    r.sourceType === 'party' &&
                    familyParties.some(p => p.id === r.sourceId) &&
                    familyParties.some(p => p.id === r.targetId)
                  )
                  .map(r => (
                    <div key={r.id} className="font-mono text-xs text-muted-foreground mt-1">
                      {parties.find(p => p.id === r.sourceId)?.abbreviation} ↔{' '}
                      {parties.find(p => p.id === r.targetId)?.abbreviation}:{' '}
                      {Math.round(r.strength * 100)}% alignment — {r.description}
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ConnectionsView = () => {
  const actorRelations = relationships.filter(r => r.sourceType === 'actor' && r.targetType === 'actor');

  return (
    <div>
      <p className="font-mono text-xs text-muted-foreground mb-4">
        Direct connections between politicians across borders.
      </p>
      <div className="space-y-3">
        {actorRelations.map(rel => {
          const source = mockActors.find(a => a.id === rel.sourceId);
          const target = mockActors.find(a => a.id === rel.targetId);
          if (!source || !target) return null;
          const srcCountry = getCountry(source.countryId);
          const tgtCountry = getCountry(target.countryId);

          return (
            <div key={rel.id} className="brutalist-border p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Link to={`/actors/${source.id}`} className="font-mono text-sm font-bold hover:underline">
                  {source.name}
                </Link>
                <span className="evidence-tag text-xs">{srcCountry?.code}</span>

                <span className="font-mono text-xs px-2 py-0.5 brutalist-border bg-secondary">
                  {rel.type.replace(/_/g, ' ').toUpperCase()}
                </span>

                <Link to={`/actors/${target.id}`} className="font-mono text-sm font-bold hover:underline">
                  {target.name}
                </Link>
                <span className="evidence-tag text-xs">{tgtCountry?.code}</span>
              </div>

              {/* Strength bar */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-secondary brutalist-border">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${rel.strength * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-muted-foreground">{Math.round(rel.strength * 100)}%</span>
              </div>

              <p className="text-xs text-muted-foreground">{rel.description}</p>
              {rel.since && (
                <span className="font-mono text-xs text-muted-foreground mt-1 block">
                  since {new Date(rel.since).toLocaleDateString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TreeView = () => {
  return (
    <div>
      <p className="font-mono text-xs text-muted-foreground mb-4">
        Hierarchical view: Continent → Country → Party → Actor.
      </p>
      <div className="space-y-4">
        {(['cont-eu', 'cont-na', 'cont-sa', 'cont-as'] as string[]).map(contId => {
          const cont = { 'cont-eu': 'Europe', 'cont-na': 'North America', 'cont-sa': 'South America', 'cont-as': 'Asia' }[contId];
          const contCountries = countries.filter(c => c.continentId === contId);
          const hasActors = contCountries.some(c => mockActors.some(a => a.countryId === c.id));
          if (!hasActors) return null;

          return (
            <div key={contId} className="brutalist-border">
              <div className="bg-primary text-primary-foreground px-4 py-2 font-mono text-xs font-bold">
                {cont?.toUpperCase()}
              </div>
              {contCountries.map(country => {
                const countryActors = mockActors.filter(a => a.countryId === country.id);
                if (countryActors.length === 0) return null;
                const countryParties = parties.filter(p => p.countryId === country.id);

                return (
                  <div key={country.id} className="brutalist-border-b last:border-b-0">
                    <div className="px-4 py-2 bg-secondary font-mono text-xs font-bold flex items-center gap-2">
                      <span className="text-muted-foreground">├─</span>
                      <Link to={`/country/${country.id}`} className="hover:underline">
                        {country.code} {country.name}
                      </Link>
                    </div>
                    {countryParties.map(party => {
                      const pActors = countryActors.filter(a => a.partyId === party.id);
                      if (pActors.length === 0) return null;
                      return (
                        <div key={party.id}>
                          <div className="px-4 py-1.5 font-mono text-xs flex items-center gap-2">
                            <span className="text-muted-foreground">│ ├─</span>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: party.color }} />
                            <span className="font-bold">{party.abbreviation}</span>
                            <span className="text-muted-foreground">{party.ideology}</span>
                          </div>
                          {pActors.map(actor => (
                            <div key={actor.id} className="px-4 py-1 font-mono text-xs flex items-center gap-2">
                              <span className="text-muted-foreground">│ │ └─</span>
                              <Link to={`/actors/${actor.id}`} className="hover:underline">
                                {actor.name}
                              </Link>
                              <span className="text-muted-foreground">{actor.role}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Relationships;
