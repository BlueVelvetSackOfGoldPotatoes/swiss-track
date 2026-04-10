import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Label } from 'recharts';

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

function getIdeologyColor(label: string | null): string {
  return IDEOLOGY_COLORS[label || ''] || 'hsl(0, 0%, 55%)';
}

interface CompassProps {
  positions: Array<PoliticalPosition & { name?: string }>;
  highlightId?: string;
  height?: number;
}

export function PoliticalCompassChart({ positions, highlightId, height = 400 }: CompassProps) {
  // Split into background and highlighted point
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
        <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeOpacity={0.5} />
        <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeOpacity={0.5} />
        <Tooltip content={renderTooltip} />
        
        {/* Background dots */}
        <Scatter data={bgData} shape="circle">
          {bgData.map((d, i) => (
            <Cell
              key={i}
              fill={getIdeologyColor(d.ideology)}
              opacity={highlightId ? 0.15 : 0.6}
              r={3}
            />
          ))}
        </Scatter>

        {/* Highlighted politician - rendered on top, larger, with stroke */}
        {highlighted.length > 0 && (
          <Scatter data={highlighted} shape="circle">
            {highlighted.map((d, i) => (
              <Cell
                key={i}
                fill={getIdeologyColor(d.ideology)}
                opacity={1}
                r={8}
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
              />
            ))}
          </Scatter>
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
        </div>
      ))}
    </div>
  );
}

export { getIdeologyColor, IDEOLOGY_COLORS };
