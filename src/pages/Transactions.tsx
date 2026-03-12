import { useState } from 'react';
import { Search, Filter, Plus, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TransactionItem } from '@/components/dashboard/TransactionItem';
import { AddTransactionDialog } from '@/components/dashboard/AddTransactionDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionType, Category, categoryLabels, expenseCategories, incomeCategories } from '@/types/finance';
import { toast } from 'sonner';

const Transactions = () => {
  const { 
    transactions, 
    addTransaction,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
  } = useTransactions();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<TransactionType>('expense');

  const allCategories = [...incomeCategories, ...expenseCategories];

  const handleAddTransaction = () => {
    setDialogType('expense');
    setDialogOpen(true);
  };

  const handleSubmitTransaction = (transaction: Parameters<typeof addTransaction>[0]) => {
    addTransaction(transaction);
    toast.success('Transaction added', {
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${transaction.amount} recorded.`,
    });
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Type', 'Category', 'Description', 'Amount'].join(','),
      ...transactions.map(t => 
        [t.date, t.type, categoryLabels[t.category], t.description, t.amount].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Export complete', {
      description: 'Your transactions have been exported to CSV.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground mt-1">Manage and track all your transactions</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={handleAddTransaction} className="btn-primary-gradient flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-xl border border-border/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select 
            value={filterType} 
            onValueChange={(val) => setFilterType(val as TransactionType | 'all')}
          >
            <SelectTrigger className="w-full md:w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filterCategory} 
            onValueChange={(val) => setFilterCategory(val as Category | 'all')}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {categoryLabels[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="text-center py-16 bg-card rounded-xl border border-border/50">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-foreground">No transactions found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery || filterType !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first transaction to get started'}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        {transactions.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <span className="text-sm text-muted-foreground">
              Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-4 text-sm">
              <span className="text-income font-medium">
                Income: ${transactions
                  .filter(t => t.type === 'income')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </span>
              <span className="text-expense font-medium">
                Expense: ${transactions
                  .filter(t => t.type === 'expense')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        )}
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

export default Transactions;
