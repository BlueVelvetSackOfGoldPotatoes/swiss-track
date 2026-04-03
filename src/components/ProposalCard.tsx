import { Link } from 'react-router-dom';
import type { Proposal } from '@/data/mockData';
import { statusLabels } from '@/data/mockData';

const statusColors: Record<Proposal['status'], string> = {
  consultation: 'bg-accent/10',
  parliamentary_deliberation: 'bg-warning/10',
  pending_vote: 'bg-destructive/10',
  accepted: 'bg-success/10',
  rejected: 'bg-secondary',
};

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  return (
    <Link
      to={`/proposals/${proposal.id}`}
      className="block brutalist-border p-4 hover:bg-secondary transition-colors"
    >
      <div className="flex items-start gap-2 flex-wrap mb-2">
        <span className={`evidence-tag ${statusColors[proposal.status]}`}>
          {statusLabels[proposal.status]}
        </span>
        <span className="evidence-tag">{proposal.type.toUpperCase()}</span>
      </div>
      <h3 className="font-bold text-sm mb-1">{proposal.title}</h3>
      <p className="text-xs text-muted-foreground font-mono mb-2">{proposal.officialTitle}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{proposal.summary}</p>
      <div className="font-mono text-xs text-muted-foreground flex flex-wrap gap-3">
        {proposal.voteDate && <span>Vote: {proposal.voteDate}</span>}
        <span>{proposal.evidenceCount} sources</span>
        <span>rev:{proposal.revisionId.slice(4, 10)}</span>
      </div>
    </Link>
  );
};

export default ProposalCard;
