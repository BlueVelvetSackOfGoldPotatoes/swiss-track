import { useParams, Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ActorTimeline from '@/components/ActorTimeline';
import ActorCharts from '@/components/ActorCharts';
import { mockActors, getCountry, getActorEvents, relationships, parties } from '@/data/mockData';
import { useState } from 'react';

const ActorDetail = () => {
  const { id } = useParams();
  const actor = mockActors.find((a) => a.id === id);

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

  const country = getCountry(actor.countryId);
  const events = getActorEvents(actor.id);
  const actorParty = parties.find(p => p.id === actor.partyId);
  const actorRelationships = relationships.filter(r =>
    (r.sourceId === actor.id && r.sourceType === 'actor') ||
    (r.targetId === actor.id && r.targetType === 'actor')
  );

  const yearsInOffice = actor.inOfficeSince
    ? Math.floor((Date.now() - new Date(actor.inOfficeSince).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8 max-w-4xl">
        <Link to="/actors" className="text-accent underline text-xs font-mono mb-4 inline-block">← ACTORS</Link>

        {/* Header */}
        <div className="brutalist-border-b pb-4 mb-6">
          <div className="flex gap-2 mb-2 flex-wrap">
            <span className="evidence-tag">{country?.code || 'N/A'}</span>
            <span className="evidence-tag">{actor.party}</span>
            <span className="evidence-tag">{actor.jurisdiction.toUpperCase()}</span>
            <span className="evidence-tag">{actor.canton}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">{actor.name}</h1>
          <p className="text-sm font-mono text-muted-foreground">{actor.role} · {country?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          {/* Main column */}
          <div>
            {/* Charts */}
            <section className="mb-8">
              <h2 className="text-xs font-mono font-bold text-muted-foreground mb-3 flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-accent" />
                ANALYTICS
              </h2>
              <ActorCharts events={events} />
            </section>

            {/* Stats bar */}
            <div className="brutalist-border p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-secondary">
              <div>
                <div className="font-mono text-xs text-muted-foreground">IN OFFICE</div>
                <div className="font-mono text-lg font-bold">{yearsInOffice ?? '?'}y</div>
              </div>
              <div>
                <div className="font-mono text-xs text-muted-foreground">VOTES TRACKED</div>
                <div className="font-mono text-lg font-bold">{actor.recentVotes.length}</div>
              </div>
              <div>
                <div className="font-mono text-xs text-muted-foreground">COMMITTEES</div>
                <div className="font-mono text-lg font-bold">{actor.committees.length}</div>
              </div>
              <div>
                <div className="font-mono text-xs text-muted-foreground">EVENTS</div>
                <div className="font-mono text-lg font-bold">{events.length}</div>
              </div>
            </div>

            {/* Git-like provenance timeline */}
            <section className="mb-8">
              <h2 className="text-xs font-mono font-bold text-muted-foreground mb-3 flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-primary" />
                PROVENANCE LOG
              </h2>
              <ActorTimeline events={events} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Party info */}
            {actorParty && (
              <div className="brutalist-border p-4">
                <h3 className="font-mono text-xs font-bold mb-2">PARTY</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: actorParty.color }} />
                  <span className="font-mono text-sm font-bold">{actorParty.abbreviation}</span>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{actorParty.name}</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">{actorParty.ideology}</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">Founded {actorParty.foundedYear}</p>
              </div>
            )}

            {/* Committees */}
            <div className="brutalist-border p-4">
              <h3 className="font-mono text-xs font-bold mb-2">COMMITTEES</h3>
              <div className="space-y-1">
                {actor.committees.map((c) => (
                  <div key={c} className="font-mono text-xs bg-secondary px-2 py-1.5 brutalist-border">{c}</div>
                ))}
              </div>
            </div>

            {/* Relationships */}
            {actorRelationships.length > 0 && (
              <div className="brutalist-border p-4">
                <h3 className="font-mono text-xs font-bold mb-2">CONNECTIONS</h3>
                <div className="space-y-2">
                  {actorRelationships.map(rel => {
                    const otherId = rel.sourceId === actor.id ? rel.targetId : rel.sourceId;
                    const other = mockActors.find(a => a.id === otherId);
                    return (
                      <div key={rel.id} className="brutalist-border-b pb-2 last:border-b-0">
                        {other && (
                          <Link to={`/actors/${other.id}`} className="font-mono text-xs font-bold hover:underline">
                            {other.name}
                          </Link>
                        )}
                        <div className="font-mono text-xs text-muted-foreground">
                          {rel.type.replace(/_/g, ' ')} · strength {Math.round(rel.strength * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{rel.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Twitter */}
            {actor.twitterHandle && (
              <div className="brutalist-border p-4">
                <h3 className="font-mono text-xs font-bold mb-2">SOCIAL MEDIA</h3>
                <div className="font-mono text-sm text-sky-600 dark:text-sky-400">{actor.twitterHandle}</div>
                <div className="font-mono text-xs text-muted-foreground mt-1">
                  {events.filter(e => e.source === 'twitter').length} tracked posts
                </div>
              </div>
            )}

            {/* Top Donors */}
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

            {/* Transparency score */}
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
                <div className="flex justify-between font-mono text-xs">
                  <span>Lobby meetings</span>
                  <span className="font-bold">{events.filter(e => e.type === 'lobbying_meeting').length}</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span>Financial disclosures</span>
                  <span className="font-bold">{events.filter(e => e.type === 'financial_disclosure').length}</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span>Corporate events</span>
                  <span className="font-bold">{events.filter(e => e.type === 'corporate_event').length}</span>
                </div>
              </div>
            </div>

            {/* Revision */}
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
