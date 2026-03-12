import { Plus, ArrowUpRight, ArrowDownRight, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onExport: () => void;
}

export function QuickActions({ onAddIncome, onAddExpense, onExport }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 animate-fade-in">
      <Button
        onClick={onAddIncome}
        className="btn-primary-gradient flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        <ArrowDownRight className="h-4 w-4" />
        Add Income
      </Button>
      
      <Button
        onClick={onAddExpense}
        variant="outline"
        className="flex items-center gap-2 border-expense/30 text-expense hover:bg-expense/10 hover:border-expense"
      >
        <Plus className="h-4 w-4" />
        <ArrowUpRight className="h-4 w-4" />
        Add Expense
      </Button>
      
      <Button
        onClick={onExport}
        variant="outline"
        className="flex items-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
}
