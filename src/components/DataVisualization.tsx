import { Character } from '@/types/character';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DataVisualizationProps {
  characters: Character[];
}

export const DataVisualization = ({ characters }: DataVisualizationProps) => {
  const groupData = characters.reduce((acc, char) => {
    acc[char.group] = (acc[char.group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(groupData).map(([name, value]) => ({
    name,
    value
  }));

  const avgStats = characters.map(char => ({
    name: char.hero.split(' ')[0],
    strength: char.stats?.strength || 0,
    agility: char.stats?.agility || 0,
    intelligence: char.stats?.intelligence || 0,
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#8B5CF6'];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Characters by Group</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Average Character Stats</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={avgStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))' }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="strength" fill="hsl(var(--primary))" />
              <Bar dataKey="agility" fill="hsl(var(--accent))" />
              <Bar dataKey="intelligence" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
