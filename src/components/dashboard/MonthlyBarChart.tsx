import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlyData } from '@/types/finance';

interface MonthlyBarChartProps {
  data: MonthlyData[];
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  return (
    <div className="chart-container animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Monthly Overview</h3>
          <p className="text-sm text-muted-foreground">Income and expense comparison</p>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => <span className="text-sm text-foreground capitalize">{value}</span>}
            />
            <Bar 
              dataKey="income" 
              fill="hsl(var(--income))" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar 
              dataKey="expense" 
              fill="hsl(var(--expense))" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
