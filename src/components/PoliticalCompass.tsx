import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

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
  const data = positions.map(p => ({
    x: p.economic_score,
    y: p.social_score,
    name: p.name || p.politician_id.slice(0, 8),
    ideology: p.ideology_label || 'Unknown',
    id: p.politician_id,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          type="number" dataKey="x" domain={[-10, 10]} name="Economic"
          tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))"
          label={{ value: '← Left — Economic — Right →', position: 'bottom', fontSize: 10, fontFamily: 'monospace', fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          type="number" dataKey="y" domain={[-10, 10]} name="Social"
          tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="hsl(var(--muted-foreground))"
          label={{ value: '← Liberal — Social — Auth →', angle: -90, position: 'left', fontSize: 10, fontFamily: 'monospace', fill: 'hsl(var(--muted-foreground))' }}
        />
        <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeOpacity={0.5} />
        <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeOpacity={0.5} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const d = payload[0].payload;
            return (
              <div className="brutalist-border bg-card p-2 text-xs font-mono shadow-lg">
                <div className="font-bold">{d.name}</div>
                <div className="text-muted-foreground">{d.ideology}</div>
                <div>Econ: {d.x} · Social: {d.y}</div>
              </div>
            );
          }}
        />
        <Scatter data={data}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={getIdeologyColor(d.ideology)}
              opacity={highlightId && d.id !== highlightId ? 0.2 : 0.7}
              r={highlightId === d.id ? 8 : 4}
            />
          ))}
        </Scatter>
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
