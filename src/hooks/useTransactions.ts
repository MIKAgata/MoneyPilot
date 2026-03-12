import { useState, useCallback, useMemo } from 'react';
import { Transaction, TransactionType, Category, FinancialSummary, MonthlyData, CategoryData } from '@/types/finance';
import { mockTransactions, mockSummary } from '@/data/mockData';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      if (filterType !== 'all' && transaction.type !== filterType) return false;
      if (filterCategory !== 'all' && transaction.category !== filterCategory) return false;
      if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (dateRange.from && new Date(transaction.date) < dateRange.from) return false;
      if (dateRange.to && new Date(transaction.date) > dateRange.to) return false;
      return true;
    });
  }, [transactions, filterType, filterCategory, searchQuery, dateRange]);

  const summary: FinancialSummary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      incomeChange: mockSummary.incomeChange,
      expenseChange: mockSummary.expenseChange,
    };
  }, [transactions]);

  const monthlyData: MonthlyData[] = useMemo(() => {
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const data: MonthlyData[] = months.map(month => ({
      month,
      income: Math.floor(Math.random() * 2000) + 4000,
      expense: Math.floor(Math.random() * 2000) + 2000,
    }));
    
    // Use actual current month data
    const currentMonthIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const currentMonthExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    data[data.length - 1] = {
      month: 'Feb',
      income: currentMonthIncome,
      expense: currentMonthExpense,
    };
    
    return data;
  }, [transactions]);

  const categoryData: CategoryData[] = useMemo(() => {
    const expenseByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    const total = Object.values(expenseByCategory).reduce((sum, val) => sum + val, 0);
    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
      'hsl(217 71% 45%)',
      'hsl(160 84% 50%)',
      'hsl(38 92% 50%)',
    ];
    
    return Object.entries(expenseByCategory)
      .map(([category, amount], index) => ({
        category: category as Category,
        amount,
        percentage: Math.round((amount / total) * 100),
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    summary,
    monthlyData,
    categoryData,
    addTransaction,
    deleteTransaction,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
  };
}
