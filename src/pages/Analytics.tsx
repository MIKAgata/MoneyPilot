import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { MonthlyBarChart } from '@/components/dashboard/MonthlyBarChart';
import { useTransactions } from '@/hooks/useTransactions';
import { categoryLabels } from '@/types/finance';
import { cn } from '@/lib/utils';

const Analytics = () => {
  const { summary, monthlyData, categoryData } = useTransactions();

  // Calculate insights
  const savingsRate = summary.totalIncome > 0 
    ? Math.round(((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100)
    : 0;
  
  const topCategory = categoryData[0];
  const avgMonthlyExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0) / monthlyData.length;

  const insights = [
    {
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      description: savingsRate >= 20 ? 'Great job! You\'re saving well.' : 'Consider reducing expenses.',
      icon: Target,
      color: savingsRate >= 20 ? 'text-income' : 'text-warning',
      bgColor: savingsRate >= 20 ? 'bg-income/10' : 'bg-warning/10',
    },
    {
      title: 'Top Spending',
      value: topCategory ? categoryLabels[topCategory.category] : 'N/A',
      description: topCategory ? `${topCategory.percentage}% of your expenses` : 'No data available',
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Monthly Avg',
      value: `$${Math.round(avgMonthlyExpense).toLocaleString()}`,
      description: 'Average monthly expense',
      icon: DollarSign,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    {
      title: 'Net Change',
      value: `$${(summary.totalIncome - summary.totalExpense).toLocaleString()}`,
      description: summary.totalIncome > summary.totalExpense ? 'Positive cash flow' : 'Negative cash flow',
      icon: summary.totalIncome > summary.totalExpense ? TrendingUp : TrendingDown,
      color: summary.totalIncome > summary.totalExpense ? 'text-income' : 'text-expense',
      bgColor: summary.totalIncome > summary.totalExpense ? 'bg-income/10' : 'bg-expense/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your financial patterns</p>
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className="stat-card bg-card border border-border/50 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg mb-4",
                insight.bgColor
              )}>
                <insight.icon className={cn("h-5 w-5", insight.color)} />
              </div>
              <p className="text-sm text-muted-foreground">{insight.title}</p>
              <p className={cn("text-2xl font-bold mt-1", insight.color)}>{insight.value}</p>
              <p className="text-xs text-muted-foreground mt-2">{insight.description}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeExpenseChart data={monthlyData} />
          <CategoryPieChart data={categoryData} />
        </div>

        <MonthlyBarChart data={monthlyData} />

        {/* Tips Section */}
        <div className="bg-card rounded-xl border border-border/50 p-6 animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Financial Tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-income" />
                  Try to save at least 20% of your income each month
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Review your subscriptions and cancel unused ones
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                  Set monthly budget limits for each category
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Track every expense, no matter how small
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
