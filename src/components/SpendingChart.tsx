
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenseStore } from '@/store/expenseStore';

const SpendingChart = () => {
  const { expenses } = useExpenseStore();

  // Group expenses by date and calculate daily totals
  const dailySpending = expenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and sort by date
  const chartData = Object.entries(dailySpending)
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: amount,
      fullDate: date
    }))
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
    .slice(-14); // Show last 14 days

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        <p>No spending data to display</p>
      </div>
    );
  }

  return (
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
  );
};

export default SpendingChart;
