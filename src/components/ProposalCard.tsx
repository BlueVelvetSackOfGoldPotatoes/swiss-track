import { Link } from 'react-router-dom';
import type { DbProposal } from '@/hooks/use-proposals';
import { statusLabels, statusColors } from '@/hooks/use-proposals';

const ProposalCard = ({ proposal }: { proposal: DbProposal }) => {
  return (
    <Link
      to={`/proposals/${proposal.id}`}
      className="block brutalist-border p-4 hover:bg-secondary transition-colors"
    >
      <div className="flex items-start gap-2 flex-wrap mb-2">
        <span className={`evidence-tag ${statusColors[proposal.status] || 'bg-muted'}`}>
          {statusLabels[proposal.status] || proposal.status.toUpperCase()}
        </span>
        <span className="evidence-tag">{proposal.proposal_type.toUpperCase()}</span>
        <span className="evidence-tag">{proposal.country_code}</span>
        {proposal.policy_area && (
          <span className="evidence-tag bg-primary/5">{proposal.policy_area.replace(/_/g, ' ').toUpperCase()}</span>
        )}
      </div>
      <h3 className="font-bold text-sm mb-1">{proposal.title}</h3>
      <p className="text-xs text-muted-foreground font-mono mb-2">{proposal.official_title}</p>
      {proposal.summary && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{proposal.summary}</p>
      )}
      <div className="font-mono text-xs text-muted-foreground flex flex-wrap gap-3">
        {proposal.vote_date && <span>Vote: {proposal.vote_date}</span>}
        <span>{proposal.evidence_count} sources</span>
        <span>{proposal.country_name}</span>
      </div>
    </Link>
  );
};

export default ProposalCard;
