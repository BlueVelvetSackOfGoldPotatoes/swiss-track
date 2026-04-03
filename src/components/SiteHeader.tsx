import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'CHANGELOG' },
  { path: '/proposals', label: 'PROPOSALS' },
  { path: '/actors', label: 'ACTORS' },
  { path: '/about', label: 'METHODOLOGY' },
];

const SiteHeader = () => {
  const location = useLocation();

  return (
    <header className="brutalist-border-b">
      <div className="container py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/" className="block">
              <h1 className="text-2xl font-extrabold tracking-tighter leading-none">
                CH·INTEL
              </h1>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                Swiss Civic Intelligence · Open Source
              </p>
            </Link>
          </div>
          <nav className="flex gap-0 font-mono text-xs">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 brutalist-border transition-colors ${
                  item.path === '/'
                    ? location.pathname === '/'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                    : location.pathname.startsWith(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
