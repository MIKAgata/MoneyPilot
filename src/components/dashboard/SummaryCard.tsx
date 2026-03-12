import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string;
  change?: number;
  icon: ReactNode;
  variant?: 'default' | 'income' | 'expense' | 'balance';
}

export function SummaryCard({ title, value, change, icon, variant = 'default' }: SummaryCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="stat-card bg-card border border-border/50 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          variant === 'income' && "bg-income/10 text-income",
          variant === 'expense' && "bg-expense/10 text-expense",
          variant === 'balance' && "bg-primary/10 text-primary",
          variant === 'default' && "bg-muted text-muted-foreground"
        )}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            isPositive && "bg-income/10 text-income",
            isNegative && "bg-expense/10 text-expense",
            !isPositive && !isNegative && "bg-muted text-muted-foreground"
          )}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : isNegative ? (
              <TrendingDown className="h-3 w-3" />
            ) : null}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className={cn(
          "text-2xl font-bold number-animate",
          variant === 'income' && "text-income",
          variant === 'expense' && "text-expense",
          variant === 'balance' && "text-foreground"
        )}>
          {value}
        </p>
      </div>
    </div>
  );
}
