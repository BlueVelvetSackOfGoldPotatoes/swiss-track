import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SearchBar from '@/components/SearchBar';
import ChangeLogItem from '@/components/ChangeLogItem';
import ProposalCard from '@/components/ProposalCard';
import ActorCard from '@/components/ActorCard';
import { mockChangelog, mockProposals, mockActors } from '@/data/mockData';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="container flex-1 py-8">
        {/* Search */}
        <div className="mb-8">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Main column: Changelog */}
          <div>
            <div className="flex items-baseline justify-between mb-4 brutalist-border-b pb-2">
              <h2 className="text-lg font-extrabold tracking-tight">WHAT CHANGED</h2>
              <span className="font-mono text-xs text-muted-foreground">
                {mockChangelog.length} entries
              </span>
            </div>
            <div>
              {mockChangelog.map((entry) => (
                <ChangeLogItem key={entry.id} entry={entry} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Pending votes */}
            <div>
              <div className="brutalist-border-b pb-2 mb-4">
                <h2 className="text-sm font-extrabold tracking-tight">PENDING VOTES</h2>
              </div>
              <div className="space-y-3">
                {mockProposals
                  .filter((p) => p.status === 'pending_vote')
                  .map((p) => (
                    <ProposalCard key={p.id} proposal={p} />
                  ))}
              </div>
            </div>

            {/* Recent actors */}
            <div>
              <div className="brutalist-border-b pb-2 mb-4">
                <h2 className="text-sm font-extrabold tracking-tight">RECENTLY UPDATED ACTORS</h2>
              </div>
              <div className="space-y-3">
                {mockActors.map((a) => (
                  <ActorCard key={a.id} actor={a} />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="brutalist-border p-4 bg-secondary">
              <h3 className="font-mono text-xs font-bold mb-3">PLATFORM STATUS</h3>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Proposals tracked</span>
                  <span className="font-bold text-foreground">4</span>
                </div>
                <div className="flex justify-between">
                  <span>Actors indexed</span>
                  <span className="font-bold text-foreground">2</span>
                </div>
                <div className="flex justify-between">
                  <span>Evidence packets</span>
                  <span className="font-bold text-foreground">78</span>
                </div>
                <div className="flex justify-between">
                  <span>Revisions published</span>
                  <span className="font-bold text-foreground">23</span>
                </div>
                <div className="flex justify-between">
                  <span>Last ingestion</span>
                  <span className="font-bold text-foreground">14:22</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
