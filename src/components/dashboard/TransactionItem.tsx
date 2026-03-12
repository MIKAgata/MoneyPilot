import { Transaction, categoryLabels, categoryIcons } from '@/types/finance';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
  showDate?: boolean;
}

export function TransactionItem({ transaction, showDate = true }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:shadow-md transition-all duration-200 animate-fade-in">
      <div className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl text-xl",
        isIncome ? "bg-income/10" : "bg-expense/10"
      )}>
        {categoryIcons[transaction.category]}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {transaction.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            isIncome ? "income-badge" : "expense-badge"
          )}>
            {categoryLabels[transaction.category]}
          </span>
          {showDate && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(transaction.date), 'MMM d, yyyy')}
            </span>
          )}
        </div>
      </div>
      
      <div className={cn(
        "text-right font-semibold number-animate",
        isIncome ? "text-income" : "text-expense"
      )}>
        {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
      </div>
    </div>
  );
}
