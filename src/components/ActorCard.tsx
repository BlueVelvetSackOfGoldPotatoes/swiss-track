import { Link } from 'react-router-dom';
import type { Actor } from '@/data/mockData';
import { getCountry } from '@/data/mockData';

const ActorCard = ({ actor }: { actor: Actor }) => {
  const country = getCountry(actor.countryId);

  return (
    <Link
      to={`/actors/${actor.id}`}
      className="block brutalist-border p-4 hover:bg-secondary transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-bold text-sm">{actor.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">
            {actor.role} · {actor.party} · {country?.code || actor.canton}
          </p>
        </div>
        <div className="flex gap-1">
          <span className="evidence-tag">{country?.code}</span>
          <span className="evidence-tag">{actor.jurisdiction.slice(0, 3).toUpperCase()}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mb-2">
        {actor.committees.map((c) => (
          <div key={c} className="font-mono">· {c}</div>
        ))}
      </div>
      <div className="font-mono text-xs text-muted-foreground">
        rev:{actor.revisionId.slice(4, 10)} · {actor.recentVotes.length} votes
      </div>
    </Link>
  );
};

export default ActorCard;
