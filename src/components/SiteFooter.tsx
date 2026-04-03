const SiteFooter = () => {
  return (
    <footer className="brutalist-border-t mt-12">
      <div className="container py-6 font-mono text-xs text-muted-foreground">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div>
            CH·INTEL — Open-source Swiss civic intelligence.
            <br />
            No endorsements. No recommendations. Evidence only.
          </div>
          <div className="text-right">
            <span className="opacity-60">build </span>
            <span className="font-mono">a3f7c2e</span>
            <span className="opacity-60"> · 2026-04-03</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
