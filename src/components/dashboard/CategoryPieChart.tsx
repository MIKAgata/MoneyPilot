import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryData, categoryLabels } from '@/types/finance';

interface CategoryPieChartProps {
  data: CategoryData[];
}

const COLORS = [
  'hsl(217 71% 25%)',
  'hsl(160 84% 39%)',
  'hsl(38 92% 50%)',
  'hsl(280 65% 60%)',
  'hsl(190 80% 45%)',
  'hsl(340 75% 55%)',
  'hsl(120 60% 45%)',
  'hsl(200 80% 50%)',
];

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="chart-container animate-slide-up">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Spending by Category</h3>
        <p className="text-sm text-muted-foreground">This month's breakdown</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="amount"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                }}
                formatter={(value: number, _name, props) => [
                  `$${value.toLocaleString()} (${props.payload.percentage}%)`,
                  categoryLabels[props.payload.category as keyof typeof categoryLabels]
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3">
          {data.slice(0, 6).map((item, index) => (
            <div key={item.category} className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {categoryLabels[item.category]}
                </p>
                <p className="text-sm font-medium text-foreground">
                  ${item.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Spending</span>
          <span className="text-lg font-bold text-foreground">${totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
