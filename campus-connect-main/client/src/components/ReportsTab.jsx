import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ReportsTab = ({ categoryTotals, totalExpenses, budget }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6 text-blue-900">Expense Reports</h3>

      {/* Pie Chart */}
      <div className="mb-8">
        <h4 className="font-bold text-lg mb-3">Expenses by Category</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryTotals}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryTotals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget status */}
      <div className="mt-8 p-4 border rounded-lg">
        <h4 className="font-bold mb-2">Current Budget Status</h4>
        <div className="flex justify-between mb-2">
          <span>Budget: ${budget}</span>
          <span>Spent: ${totalExpenses.toFixed(2)}</span>
          <span className={totalExpenses > budget ? 'text-red-500' : 'text-green-500'}>
            Remaining: ${(budget - totalExpenses).toFixed(2)}
          </span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${totalExpenses > budget ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min((totalExpenses / budget) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;