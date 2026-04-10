import { ExternalLink } from 'lucide-react';

interface SourceBadgeProps {
  label: string;
  url?: string;
  type?: 'fact' | 'estimate' | 'model' | 'official';
}

const typeStyles: Record<string, string> = {
  fact: 'bg-green-500/10 text-green-700 dark:text-green-400',
  official: 'bg-primary/10 text-primary',
  estimate: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  model: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
};

export function SourceBadge({ label, url, type = 'fact' }: SourceBadgeProps) {
  const style = typeStyles[type] || typeStyles.fact;
  
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded ${style} hover:opacity-80 transition-opacity`}
      >
        <ExternalLink className="w-2.5 h-2.5" />
        {label}
      </a>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded ${style}`}>
      {label}
    </span>
  );
}

export function ProvenanceBar({ sources }: { sources: Array<{ label: string; url?: string; type?: SourceBadgeProps['type'] }> }) {
  if (sources.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {sources.map((s, i) => (
        <SourceBadge key={i} {...s} />
      ))}
    </div>
  );
}
