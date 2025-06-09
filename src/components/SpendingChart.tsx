
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useExpenseStore } from '@/store/expenseStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const SpendingChart = () => {
  const { expenses, monthlyBudget } = useExpenseStore();
  const [timePeriod, setTimePeriod] = useState('14days');

  // Filter and process expenses based on time period
  const getChartData = () => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timePeriod) {
      case '7days':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '14days':
        cutoffDate.setDate(now.getDate() - 14);
        break;
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      default:
        cutoffDate.setDate(now.getDate() - 14);
    }

    const filteredExpenses = expenses.filter(expense => new Date(expense.date) >= cutoffDate);

    // Group expenses by date and calculate daily totals
    const dailySpending = filteredExpenses.reduce((acc, expense) => {
      const date = expense.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by date
    return Object.entries(dailySpending)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: amount,
        fullDate: date
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  };

  const chartData = getChartData();
  
  // Calculate daily budget target
  const dailyBudgetTarget = monthlyBudget > 0 ? monthlyBudget / 30 : 0;
  const maxBudgetLine = dailyBudgetTarget * 1.5; // 150% of daily budget as max line

  if (chartData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Spending Over Time</h3>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="14days">14 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-64 flex items-center justify-center text-slate-500">
          <p>No spending data to display for selected period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Spending Over Time</h3>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 Days</SelectItem>
            <SelectItem value="14days">14 Days</SelectItem>
            <SelectItem value="30days">30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spent']}
              labelStyle={{ color: '#334155' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            {dailyBudgetTarget > 0 && (
              <>
                <ReferenceLine 
                  y={dailyBudgetTarget} 
                  stroke="#22c55e" 
                  strokeDasharray="5 5"
                  label={{ value: "Daily Target", position: "right" }}
                />
                <ReferenceLine 
                  y={maxBudgetLine} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  label={{ value: "Max Limit", position: "right" }}
                />
              </>
            )}
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#475569" 
              strokeWidth={3}
              dot={{ fill: '#475569', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#475569', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {dailyBudgetTarget > 0 && (
        <div className="flex text-xs text-slate-600 space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-green-500 mr-1"></div>
            <span>Daily Target: ${dailyBudgetTarget.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-red-500 mr-1"></div>
            <span>Max Limit: ${maxBudgetLine.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingChart;
