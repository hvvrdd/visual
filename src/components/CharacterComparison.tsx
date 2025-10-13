import { Character } from '@/types/character';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface CharacterComparisonProps {
  characters: Character[];
}

export const CharacterComparison = ({ characters }: CharacterComparisonProps) => {
  if (characters.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Select characters to compare their stats</p>
      </Card>
    );
  }

  const chartData = [
    { stat: 'Strength', ...Object.fromEntries(characters.map(c => [c.hero, c.stats?.strength || 0])) },
    { stat: 'Agility', ...Object.fromEntries(characters.map(c => [c.hero, c.stats?.agility || 0])) },
    { stat: 'Intelligence', ...Object.fromEntries(characters.map(c => [c.hero, c.stats?.intelligence || 0])) },
    { stat: 'Web Slinging', ...Object.fromEntries(characters.map(c => [c.hero, c.stats?.webSlinging || 0])) },
    { stat: 'Combat', ...Object.fromEntries(characters.map(c => [c.hero, c.stats?.combat || 0])) },
  ];

  const colors = ['hsl(var(--primary))', 'hsl(var(--accent))', '#8B5CF6', '#F59E0B'];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Character Comparison</h2>
        <div className="flex gap-2">
          {characters.map((char, idx) => (
            <Badge key={char.index_character} style={{ backgroundColor: colors[idx] }}>
              {char.hero}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="stat" tick={{ fill: 'hsl(var(--foreground))' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              {characters.map((char, idx) => (
                <Radar
                  key={char.index_character}
                  name={char.hero}
                  dataKey={char.hero}
                  stroke={colors[idx]}
                  fill={colors[idx]}
                  fillOpacity={0.3}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {characters.map((char, idx) => (
            <Card key={char.index_character} className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={char.url || '/placeholder.svg'}
                  alt={char.hero}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{char.hero}</h3>
                    <Badge variant="outline">{char.name}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {char.stats && Object.entries(char.stats).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key}:</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};
