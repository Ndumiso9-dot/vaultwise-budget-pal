
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useExpenseStore } from "@/store/expenseStore";
import { toast } from "sonner";
import { Target } from "lucide-react";

interface BudgetGoalsProps {
  onClose: () => void;
}

const BudgetGoals = ({ onClose }: BudgetGoalsProps) => {
  const { monthlyBudget, setMonthlyBudget } = useExpenseStore();
  const [budget, setBudget] = useState(monthlyBudget.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budgetAmount = parseFloat(budget);
    
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    setMonthlyBudget(budgetAmount);
    toast.success("Budget goal updated successfully!");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-emerald-600" />
            Set Monthly Budget Goal
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="budget">Monthly Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="1000.00"
              required
            />
            <p className="text-sm text-slate-600 mt-1">
              Set a realistic monthly spending limit to help you stay on track.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">Budget Tips</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Consider your income and fixed expenses</li>
              <li>• Leave room for unexpected costs</li>
              <li>• Start with a conservative amount</li>
              <li>• Adjust as you learn your spending patterns</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Set Budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetGoals;
