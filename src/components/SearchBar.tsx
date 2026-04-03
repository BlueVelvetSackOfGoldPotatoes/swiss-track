import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="brutalist-border flex items-center">
      <div className="px-3 py-2.5 brutalist-border border-t-0 border-b-0 border-l-0 bg-secondary">
        <Search className="w-4 h-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search actors, proposals, laws, cantons..."
        className="flex-1 px-3 py-2.5 bg-transparent text-sm font-mono placeholder:text-muted-foreground focus:outline-none"
      />
      <button className="px-4 py-2.5 bg-primary text-primary-foreground font-mono text-xs font-bold hover:opacity-80 transition-opacity">
        FIND
      </button>
    </div>
  );
};

export default SearchBar;
