export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'gift'
  | 'other_income'
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'bills'
  | 'health'
  | 'education'
  | 'travel'
  | 'other_expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
  createdAt: string;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  incomeChange: number;
  expenseChange: number;
}

export interface CategoryData {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export const categoryLabels: Record<Category, string> = {
  salary: 'Salary',
  freelance: 'Freelance',
  investment: 'Investment',
  gift: 'Gift',
  other_income: 'Other Income',
  food: 'Food & Dining',
  transport: 'Transportation',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  bills: 'Bills & Utilities',
  health: 'Healthcare',
  education: 'Education',
  travel: 'Travel',
  other_expense: 'Other Expense',
};

export const categoryIcons: Record<Category, string> = {
  salary: '💼',
  freelance: '💻',
  investment: '📈',
  gift: '🎁',
  other_income: '💰',
  food: '🍽️',
  transport: '🚗',
  shopping: '🛍️',
  entertainment: '🎬',
  bills: '📄',
  health: '🏥',
  education: '📚',
  travel: '✈️',
  other_expense: '📦',
};

export const incomeCategories: Category[] = ['salary', 'freelance', 'investment', 'gift', 'other_income'];
export const expenseCategories: Category[] = ['food', 'transport', 'shopping', 'entertainment', 'bills', 'health', 'education', 'travel', 'other_expense'];
