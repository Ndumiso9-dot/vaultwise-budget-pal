import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, TrendingUp, Target, Award, Wallet, BarChart3 } from "lucide-react";
import ExpenseForm from "@/components/ExpenseForm";
import BudgetGoals from "@/components/BudgetGoals";
import SpendingChart from "@/components/SpendingChart";
import CategoryChart from "@/components/CategoryChart";
import RewardsPanel from "@/components/RewardsPanel";
import MonthlyPerformance from "@/components/MonthlyPerformance";
import { useExpenseStore } from "@/store/expenseStore";
import { toast } from "sonner";

const Index = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetGoals, setShowBudgetGoals] = useState(false);
  const { expenses, totalSpent, monthlyBudget, getUserLevel, getAchievements } = useExpenseStore();

  const userLevel = getUserLevel();
  const achievements = getAchievements();
  const budgetUsed = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  useEffect(() => {
    if (budgetUsed > 100) {
      toast.error("Budget exceeded! Consider reviewing your spending.");
    } else if (budgetUsed > 80) {
      toast.warning("You're approaching your budget limit.");
    }
  }, [budgetUsed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Bankroll</h1>
                <p className="text-sm text-slate-600">Professional Budget Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                Level {userLevel}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {achievements.length} Badges
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium opacity-90">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
              <p className="text-sm text-slate-600">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium opacity-90">Budget Used</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{budgetUsed.toFixed(1)}%</p>
              <p className="text-sm opacity-75 mt-1">of ${monthlyBudget}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium opacity-90">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{expenses.length}</p>
              <p className="text-sm opacity-75 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button 
            onClick={() => setShowExpenseForm(true)}
            className="bg-slate-700 hover:bg-slate-800 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          <Button 
            onClick={() => setShowBudgetGoals(true)}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Target className="w-4 h-4 mr-2" />
            Set Budget Goals
          </Button>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-slate-600" />
                Spending Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryChart />
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance */}
        <div className="mb-8">
          <MonthlyPerformance />
        </div>

        {/* Rewards and Achievements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-indigo-600" />
              Achievements & Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RewardsPanel />
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No expenses recorded yet</p>
                <p className="text-sm text-slate-500 mt-1">Start tracking your spending to see insights</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{expense.description}</p>
                      <p className="text-sm text-slate-600">{expense.category} • {expense.date}</p>
                    </div>
                    <p className="font-bold text-lg text-slate-900">${expense.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showExpenseForm && (
        <ExpenseForm onClose={() => setShowExpenseForm(false)} />
      )}
      
      {showBudgetGoals && (
        <BudgetGoals onClose={() => setShowBudgetGoals(false)} />
      )}
    </div>
  );
};

export default Index;
