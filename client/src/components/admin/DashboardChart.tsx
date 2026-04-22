import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface ChartData {
  name: string;
  count: number;
  color: string;
}

export function DashboardChart({ data }: { data?: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-full border-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <CardTitle>Statistik Kategori</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Belum ada data artikel untuk ditampilkan.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full border-primary/10 bg-card/30 backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <CardTitle>Distribusi Artikel per Kategori</CardTitle>
        </div>
        <CardDescription>
          Jumlah artikel yang ada pada portal berdasarkan masing-masing kategori.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickMargin={10} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: 12 }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'var(--tw-colors-muted)', opacity: 0.2 }}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid var(--tw-colors-border)', 
                  backgroundColor: 'var(--tw-colors-card)',
                  color: 'var(--tw-colors-foreground)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Bar dataKey="count" name="Jumlah Artikel" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || 'hsl(var(--primary))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
