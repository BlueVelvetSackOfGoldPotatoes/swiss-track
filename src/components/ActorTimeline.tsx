import type { ActorEvent } from '@/data/mockData';
import { eventTypeLabels } from '@/data/mockData';
import { useState } from 'react';

interface Props {
  events: ActorEvent[];
}

const eventTypeColor: Record<ActorEvent['type'], string> = {
  vote: 'border-primary',
  speech: 'border-accent',
  committee_join: 'border-green-600',
  committee_leave: 'border-destructive',
  election: 'border-yellow-600',
  appointment: 'border-blue-600',
  resignation: 'border-destructive',
  scandal: 'border-red-700',
  policy_change: 'border-purple-600',
  party_switch: 'border-orange-600',
  legislation_sponsored: 'border-green-600',
  foreign_meeting: 'border-blue-500',
};

const ActorTimeline = ({ events }: Props) => {
  const [filter, setFilter] = useState<string>('all');

  const types = Array.from(new Set(events.map(e => e.type)));
  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`evidence-tag text-xs cursor-pointer ${filter === 'all' ? 'bg-primary text-primary-foreground' : ''}`}
        >
          ALL ({events.length})
        </button>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`evidence-tag text-xs cursor-pointer ${filter === t ? 'bg-primary text-primary-foreground' : ''}`}
          >
            {eventTypeLabels[t]} ({events.filter(e => e.type === t).length})
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

        {filtered.map((event, i) => (
          <div key={event.id} className="relative pl-12 pb-6 last:pb-0">
            {/* Node */}
            <div className={`absolute left-3 top-1 w-[14px] h-[14px] rounded-full border-2 bg-background ${eventTypeColor[event.type] || 'border-muted-foreground'}`} />
            {/* Branch line for merge commits */}
            {i > 0 && event.diff && (
              <div className="absolute left-[12px] top-[-4px] w-[14px] h-[12px] border-l-2 border-b-2 border-dashed border-muted-foreground rounded-bl-md" />
            )}

            {/* Content */}
            <div className="brutalist-border p-3 bg-background hover:bg-secondary/50 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="evidence-tag text-xs">{eventTypeLabels[event.type]}</span>
                  <span className="font-mono text-xs text-muted-foreground">{event.hash}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(event.timestamp).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-sm mb-1">{event.title}</h3>
              <p className="text-xs text-muted-foreground">{event.description}</p>

              {/* Diff block */}
              {event.diff && (
                <div className="mt-2 font-mono text-xs brutalist-border p-2 bg-secondary/50">
                  {event.diff.removed && <div className="diff-removed">- {event.diff.removed}</div>}
                  {event.diff.added && <div className="diff-added">+ {event.diff.added}</div>}
                </div>
              )}

              {/* Evidence count */}
              <div className="mt-2 font-mono text-xs text-muted-foreground">
                {event.evidenceCount} evidence packet{event.evidenceCount !== 1 ? 's' : ''}
                {event.sourceUrl && <a href={event.sourceUrl} className="ml-2 text-accent underline">source →</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActorTimeline;
