import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ActorCard from '@/components/ActorCard';
import { mockActors } from '@/data/mockData';

const Actors = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8">
        <div className="brutalist-border-b pb-2 mb-6">
          <h2 className="text-lg font-extrabold tracking-tight">ALL ACTORS</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Politicians, parties, committees, and institutions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockActors.map((a) => (
            <ActorCard key={a.id} actor={a} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Actors;
