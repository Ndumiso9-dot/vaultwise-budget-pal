
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useExpenseStore } from '@/store/expenseStore';
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';

const MonthlyPerformance = () => {
  const { expenses, monthlyBudget } = useExpenseStore();

  // Get current month expenses
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthExpenses = expenses.filter(expense => new Date(expense.date) >= currentMonthStart);
  const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Get previous month expenses
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const prevMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= prevMonthStart && expenseDate <= prevMonthEnd;
  });
  const prevMonthTotal = prevMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate performance metrics
  const budgetUsage = monthlyBudget > 0 ? (currentMonthTotal / monthlyBudget) * 100 : 0;
  const monthlyChange = prevMonthTotal > 0 ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100 : 0;
  const isOverBudget = currentMonthTotal > monthlyBudget && monthlyBudget > 0;
  const isImproving = currentMonthTotal < prevMonthTotal;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercentage = (percent: number) => `${Math.abs(percent).toFixed(1)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Monthly Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Month */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">This Month</span>
              {isOverBudget && (
                <Badge variant="destructive" className="text-xs">Over Budget</Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(currentMonthTotal)}</p>
            {monthlyBudget > 0 && (
              <div className="flex items-center text-sm">
                <Target className="w-4 h-4 mr-1 text-blue-500" />
                <span className="text-slate-600">
                  {formatPercentage(budgetUsage)} of {formatCurrency(monthlyBudget)} budget
                </span>
              </div>
            )}
          </div>

          {/* Previous Month */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Last Month</span>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(prevMonthTotal)}</p>
            <div className="flex items-center text-sm">
              {isImproving ? (
                <>
                  <TrendingDown className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-green-600">
                    {formatPercentage(monthlyChange)} less than current
                  </span>
                </>
              ) : monthlyChange > 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 mr-1 text-red-500" />
                  <span className="text-red-600">
                    {formatPercentage(monthlyChange)} more than current
                  </span>
                </>
              ) : (
                <span className="text-slate-600">Same as current month</span>
              )}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="pt-4 border-t border-slate-200">
          <h4 className="font-medium text-slate-900 mb-2">Performance Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Monthly Change:</span>
              <span className={monthlyChange > 0 ? 'text-red-600' : monthlyChange < 0 ? 'text-green-600' : 'text-slate-600'}>
                {monthlyChange > 0 ? '+' : ''}{formatPercentage(monthlyChange)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Budget Status:</span>
              <span className={isOverBudget ? 'text-red-600' : 'text-green-600'}>
                {isOverBudget ? 'Over Budget' : monthlyBudget > 0 ? 'Within Budget' : 'No Budget Set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Expenses This Month:</span>
              <span className="text-slate-900">{currentMonthExpenses.length} transactions</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyPerformance;
