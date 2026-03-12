import { useState, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TransactionItem } from '@/components/dashboard/TransactionItem';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { format, parseISO, isThisMonth, isThisWeek, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

type GroupBy = 'day' | 'week' | 'month';

const History = () => {
  const { allTransactions } = useTransactions();
  const [groupBy, setGroupBy] = useState<GroupBy>('day');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const groupedTransactions = useMemo(() => {
    const groups = new Map<string, typeof allTransactions>();
    
    allTransactions.forEach(transaction => {
      const date = parseISO(transaction.date);
      let key: string;
      
      switch (groupBy) {
        case 'day':
          key = format(date, 'yyyy-MM-dd');
          break;
        case 'week':
          key = format(date, "yyyy-'W'ww");
          break;
        case 'month':
          key = format(date, 'yyyy-MM');
          break;
      }
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(transaction);
    });

    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [allTransactions, groupBy]);

  const formatGroupLabel = (key: string, groupBy: GroupBy) => {
    const date = key.includes('W') 
      ? new Date(parseInt(key.split('-W')[0]), 0, 1 + (parseInt(key.split('-W')[1]) - 1) * 7)
      : parseISO(key.length === 7 ? `${key}-01` : key);
    
    switch (groupBy) {
      case 'day':
        if (isToday(date)) return 'Today';
        return format(date, 'EEEE, MMMM d, yyyy');
      case 'week':
        if (isThisWeek(date)) return 'This Week';
        return `Week of ${format(date, 'MMM d, yyyy')}`;
      case 'month':
        if (isThisMonth(date)) return 'This Month';
        return format(date, 'MMMM yyyy');
    }
  };

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const getGroupTotals = (transactions: typeof allTransactions) => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">History</h1>
            <p className="text-muted-foreground mt-1">Browse your transaction history</p>
          </div>
          
          {/* Group By Toggle */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(['day', 'week', 'month'] as GroupBy[]).map((option) => (
              <button
                key={option}
                onClick={() => setGroupBy(option)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all capitalize",
                  groupBy === option
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {groupedTransactions.map(([key, transactions]) => {
            const isExpanded = !expandedGroups.has(key);
            const totals = getGroupTotals(transactions);
            
            return (
              <div key={key} className="bg-card rounded-xl border border-border/50 overflow-hidden animate-slide-up">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(key)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">
                        {formatGroupLabel(key, groupBy)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="flex gap-3 text-sm">
                        <span className="text-income">+${totals.income.toLocaleString()}</span>
                        <span className="text-expense">-${totals.expense.toLocaleString()}</span>
                      </div>
                      <p className={cn(
                        "text-sm font-medium",
                        totals.net >= 0 ? "text-income" : "text-expense"
                      )}>
                        Net: {totals.net >= 0 ? '+' : ''}${totals.net.toLocaleString()}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Transactions */}
                {isExpanded && (
                  <div className="border-t border-border/50 p-4 space-y-3">
                    {transactions.map((transaction) => (
                      <TransactionItem 
                        key={transaction.id} 
                        transaction={transaction} 
                        showDate={groupBy !== 'day'}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {groupedTransactions.length === 0 && (
            <div className="text-center py-16 bg-card rounded-xl border border-border/50">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-foreground">No history yet</h3>
              <p className="text-muted-foreground mt-1">Your transaction history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default History;
