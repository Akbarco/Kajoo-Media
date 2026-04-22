import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Rectangle } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
            <div className="w-1 h-6 bg-primary" />
            <CardTitle className="font-serif text-2xl">Distribusi Artikel</CardTitle>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Per Kategori</span>
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
      <CardHeader className="pb-8">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-muted-foreground" />
          <CardTitle className="font-serif text-2xl">Distribusi Artikel</CardTitle>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1 ml-2">Per Kategori</span>
        </div>
        <CardDescription className="text-sm">
          Jumlah artikel berdasarkan masing-masing kategori
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 40,
                right: 0,
                left: 0,
                bottom: 20,
              }}
            >
              <defs>
                {data.map((entry, index) => (
                  <linearGradient key={`grad-${index}`} id={`colorGrad-${index}`} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={`${entry.color || '#2563EB'}99`} />
                    <stop offset="100%" stopColor={`${entry.color || '#2563EB'}44`} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 13, fill: 'currentColor', opacity: 0.7 }} 
                tickMargin={15} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip cursor={{ fill: 'transparent' }} content={() => <></>} />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
                activeBar={(props: any) => {
                  const { x, y, width, height, payload, value } = props;
                  return (
                    <g>
                      <Rectangle x={x} y={y} width={width} height={height} fill={payload.color || '#2563EB'} radius={[4, 4, 0, 0]} />
                      <rect x={x + width / 2 - 45} y={y - 40} width={90} height={30} fill="white" rx={4} />
                      <text x={x + width / 2} y={y - 20} fill="black" textAnchor="middle" fontSize={13} fontWeight="bold" fontFamily="sans-serif">
                        {value} artikel
                      </text>
                    </g>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorGrad-${index})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
