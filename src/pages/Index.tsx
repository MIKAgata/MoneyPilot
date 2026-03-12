import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { MonthlyBarChart } from '@/components/dashboard/MonthlyBarChart';
import { AddTransactionDialog } from '@/components/dashboard/AddTransactionDialog';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionType } from '@/types/finance';
import { toast } from 'sonner';

const Index = () => {
  const { 
    transactions, 
    summary, 
    monthlyData, 
    categoryData, 
    addTransaction 
  } = useTransactions();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<TransactionType>('expense');

  const handleAddIncome = () => {
    setDialogType('income');
    setDialogOpen(true);
  };

  const handleAddExpense = () => {
    setDialogType('expense');
    setDialogOpen(true);
  };

  const handleExport = () => {
    toast.success('Export started', {
      description: 'Your data is being prepared for download.',
    });
  };

  const handleSubmitTransaction = (transaction: Parameters<typeof addTransaction>[0]) => {
    addTransaction(transaction);
    toast.success('Transaction added', {
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${transaction.amount} recorded.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, John! Here's your financial overview.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
            <Calendar className="h-4 w-4" />
            <span>February 2025</span>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions 
          onAddIncome={handleAddIncome}
          onAddExpense={handleAddExpense}
          onExport={handleExport}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <SummaryCard
            title="Total Balance"
            value={`$${summary.totalBalance.toLocaleString()}`}
            icon={<Wallet className="h-6 w-6" />}
            variant="balance"
          />
          <SummaryCard
            title="Total Income"
            value={`$${summary.totalIncome.toLocaleString()}`}
            change={summary.incomeChange}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="income"
          />
          <SummaryCard
            title="Total Expense"
            value={`$${summary.totalExpense.toLocaleString()}`}
            change={summary.expenseChange}
            icon={<TrendingDown className="h-6 w-6" />}
            variant="expense"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeExpenseChart data={monthlyData} />
          <CategoryPieChart data={categoryData} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyBarChart data={monthlyData} />
          <RecentTransactions transactions={transactions} />
        </div>
      </div>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultType={dialogType}
        onSubmit={handleSubmitTransaction}
      />
    </DashboardLayout>
  );
};

export default Index;
