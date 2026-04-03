import { Link } from 'react-router-dom';
import type { Actor } from '@/data/mockData';

const ActorCard = ({ actor }: { actor: Actor }) => {
  return (
    <Link
      to={`/actors/${actor.id}`}
      className="block brutalist-border p-4 hover:bg-secondary transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-bold text-sm">{actor.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">
            {actor.role} · {actor.party} · {actor.canton}
          </p>
        </div>
        <span className="evidence-tag">{actor.jurisdiction.slice(0, 3).toUpperCase()}</span>
      </div>
      <div className="text-xs text-muted-foreground mb-2">
        {actor.committees.map((c) => (
          <div key={c} className="font-mono">· {c}</div>
        ))}
      </div>
      <div className="font-mono text-xs text-muted-foreground">
        rev:{actor.revisionId.slice(4, 10)} · {actor.recentVotes.length} recent votes
      </div>
    </Link>
  );
};

export default ActorCard;
