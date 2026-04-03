import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ProposalCard from '@/components/ProposalCard';
import { mockProposals } from '@/data/mockData';

const Proposals = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8">
        <div className="brutalist-border-b pb-2 mb-6">
          <h2 className="text-lg font-extrabold tracking-tight">ALL PROPOSALS</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Federal initiatives, referendums, counter-proposals, and bills.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockProposals.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Proposals;
