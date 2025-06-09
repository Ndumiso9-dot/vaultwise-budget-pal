
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useExpenseStore } from '@/store/expenseStore';

const COLORS = [
  '#475569', // slate
  '#1e40af', // blue
  '#4338ca', // indigo
  '#7c3aed', // violet
  '#dc2626', // red
  '#ea580c', // orange
  '#65a30d', // lime
  '#0891b2', // cyan
];

const CategoryChart = () => {
  const { expenses } = useExpenseStore();

  // Group expenses by category
  const categorySpending = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array for chart
  const chartData = Object.entries(categorySpending).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        <p>No category data to display</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
