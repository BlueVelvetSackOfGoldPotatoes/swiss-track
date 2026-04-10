import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

export interface PoliticalPosition {
  id: string;
  politician_id: string;
  economic_score: number;
  social_score: number;
  eu_integration_score: number;
  environmental_score: number;
  immigration_score: number;
  education_priority: number;
  science_priority: number;
  healthcare_priority: number;
  defense_priority: number;
  economy_priority: number;
  justice_priority: number;
  social_welfare_priority: number;
  environment_priority: number;
  ideology_label: string | null;
  key_positions: Record<string, string> | null;
}

const IDEOLOGY_COLORS: Record<string, string> = {
  'Social Democrat': 'hsl(0, 65%, 50%)',
  'Green / Ecologist': 'hsl(140, 55%, 40%)',
  'Democratic Socialist': 'hsl(345, 60%, 45%)',
  'Christian Democrat / Centre-Right': 'hsl(215, 45%, 50%)',
  'Liberal': 'hsl(45, 75%, 50%)',
  'National Conservative': 'hsl(25, 60%, 45%)',
  'Right-Wing Populist': 'hsl(270, 40%, 40%)',
  'Centrist / Unclassified': 'hsl(0, 0%, 55%)',
};

// Ideal economic score (x-axis) for each ideology family
const IDEOLOGY_IDEAL_X: Record<string, number> = {
  'Democratic Socialist': -7,
  'Social Democrat': -4,
  'Green / Ecologist': -3,
  'Liberal': 1,
  'Centrist / Unclassified': 0,
  'Christian Democrat / Centre-Right': 4,
  'National Conservative': 5,
  'Right-Wing Populist': 3,
};

function getIdeologyColor(label: string | null): string {
  return IDEOLOGY_COLORS[label || ''] || 'hsl(0, 0%, 55%)';
}

interface CompassProps {
  positions: Array<PoliticalPosition & { name?: string }>;
  highlightId?: string;
  height?: number;
  showIdeologyLines?: boolean;
}

export function PoliticalCompassChart({ positions, highlightId, height = 400, showIdeologyLines = true }: CompassProps) {
  const bgData = positions
    .filter(p => !highlightId || p.politician_id !== highlightId)
    .map(p => ({
      x: Number(p.economic_score),
      y: Number(p.social_score),
      name: p.name || p.politician_id.slice(0, 8),
      ideology: p.ideology_label || 'Unknown',
      id: p.politician_id,
    }));

  const highlighted = highlightId
    ? positions.filter(p => p.politician_id === highlightId).map(p => ({
        x: Number(p.economic_score),
        y: Number(p.social_score),
        name: p.name || p.politician_id.slice(0, 8),
        ideology: p.ideology_label || 'Unknown',
        id: p.politician_id,
      }))
    : [];

  // Determine which ideologies are present in data
  const presentIdeologies = new Set(positions.map(p => p.ideology_label).filter(Boolean));

  const renderTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div className="brutalist-border bg-card p-2 text-xs font-mono shadow-lg">
        <div className="font-bold">{d.name}</div>
        <div className="text-muted-foreground">{d.ideology}</div>
        <div>Econ: {d.x} · Social: {d.y}</div>
      </div>
    );
  };

  const BgDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    return (
      <circle cx={cx} cy={cy} r={3} fill={getIdeologyColor(payload.ideology)} opacity={highlightId ? 0.15 : 0.6} />
    );
  };

  const HighlightDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    return (
      <circle cx={cx} cy={cy} r={10} fill={getIdeologyColor(payload.ideology)} opacity={1} stroke="hsl(var(--foreground))" strokeWidth={2.5} />
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" dataKey="x" domain={[-10, 10]} name="Economic"
          tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))">
          <Label value="← Left — Economic — Right →" position="bottom" offset={15} style={{ fontSize: 10, fontFamily: 'monospace', fill: 'hsl(var(--muted-foreground))' }} />
        </XAxis>
        <YAxis type="number" dataKey="y" domain={[-10, 10]} name="Social"
          tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))">
          <Label value="← Liberal — Social — Auth →" angle={-90} position="left" offset={10} style={{ fontSize: 10, fontFamily: 'monospace', fill: 'hsl(var(--muted-foreground))' }} />
        </YAxis>

        {/* Center reference lines */}
        <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeOpacity={0.5} />
        <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeOpacity={0.5} />

        {/* Ideology ideal position lines */}
        {showIdeologyLines && Object.entries(IDEOLOGY_IDEAL_X)
          .filter(([label]) => presentIdeologies.has(label))
          .map(([label, xPos]) => (
            <ReferenceLine
              key={label}
              x={xPos}
              stroke={IDEOLOGY_COLORS[label] || 'hsl(0,0%,50%)'}
              strokeDasharray="8 4"
              strokeOpacity={0.45}
              strokeWidth={1.5}
            />
          ))
        }

        <Tooltip content={renderTooltip} />

        {/* Background dots */}
        <Scatter data={bgData} shape={<BgDot />} />

        {/* Highlighted politician */}
        {highlighted.length > 0 && (
          <Scatter data={highlighted} shape={<HighlightDot />} />
        )}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function IdeologyLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
      {Object.entries(IDEOLOGY_COLORS).map(([label, color]) => (
        <div key={label} className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          {label}
          {IDEOLOGY_IDEAL_X[label] !== undefined && (
            <span className="text-muted-foreground ml-0.5">({IDEOLOGY_IDEAL_X[label] > 0 ? '+' : ''}{IDEOLOGY_IDEAL_X[label]})</span>
          )}
        </div>
      ))}
    </div>
  );
}

export { getIdeologyColor, IDEOLOGY_COLORS };
