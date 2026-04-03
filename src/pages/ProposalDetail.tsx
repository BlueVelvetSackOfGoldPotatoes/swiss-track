import { useParams, Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { mockProposals, statusLabels } from '@/data/mockData';

const ProposalDetail = () => {
  const { id } = useParams();
  const proposal = mockProposals.find((p) => p.id === id);

  if (!proposal) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container flex-1 py-8">
          <p className="font-mono text-sm text-muted-foreground">Proposal not found.</p>
          <Link to="/proposals" className="text-accent underline text-sm mt-2 inline-block">
            ← Back to proposals
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8 max-w-3xl">
        <Link to="/proposals" className="text-accent underline text-xs font-mono mb-4 inline-block">
          ← PROPOSALS
        </Link>

        <div className="brutalist-border-b pb-4 mb-6">
          <div className="flex gap-2 mb-2 flex-wrap">
            <span className="evidence-tag bg-destructive/10">{statusLabels[proposal.status]}</span>
            <span className="evidence-tag">{proposal.type.toUpperCase()}</span>
            <span className="evidence-tag">{proposal.jurisdiction.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">{proposal.title}</h1>
          <p className="text-sm font-mono text-muted-foreground">{proposal.officialTitle}</p>
        </div>

        {/* Summary */}
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold text-muted-foreground mb-2">SUMMARY</h2>
          <p className="text-sm leading-relaxed">{proposal.summary}</p>
          <span className="evidence-fact mt-2 inline-block">FACT · official source</span>
        </section>

        {/* Key details */}
        <section className="brutalist-border p-4 mb-6">
          <h2 className="text-xs font-mono font-bold mb-3">KEY DETAILS</h2>
          <div className="space-y-2 font-mono text-xs">
            {proposal.voteDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vote date</span>
                <span className="font-bold">{proposal.voteDate}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Submitted</span>
              <span>{proposal.submittedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sponsors</span>
              <span>{proposal.sponsors.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Evidence packets</span>
              <span className="font-bold">{proposal.evidenceCount}</span>
            </div>
          </div>
        </section>

        {/* Affected laws */}
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold text-muted-foreground mb-2">AFFECTED LAWS</h2>
          <div className="space-y-1">
            {proposal.affectedLaws.map((law) => (
              <div key={law} className="font-mono text-sm brutalist-border px-3 py-1.5 bg-secondary">
                {law}
              </div>
            ))}
          </div>
        </section>

        {/* Legal diff placeholder */}
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold text-muted-foreground mb-2">LEGAL DIFF</h2>
          <div className="brutalist-border p-4 font-mono text-xs space-y-1">
            <div className="diff-removed">- Art. 14 Abs. 2: Der Umwandlungssatz beträgt 6,8 Prozent.</div>
            <div className="diff-added">+ Art. 14 Abs. 2: Der Umwandlungssatz beträgt 6,0 Prozent.</div>
            <div className="mt-2 text-muted-foreground">// Placeholder diff — full legal text comparison pending ingestion.</div>
          </div>
        </section>

        {/* Revision info */}
        <section className="brutalist-border-t pt-4 mt-8">
          <div className="font-mono text-xs text-muted-foreground flex flex-wrap gap-4">
            <span>revision: {proposal.revisionId}</span>
            <span>sources: {proposal.evidenceCount}</span>
            <span>status: {proposal.status}</span>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ProposalDetail;
