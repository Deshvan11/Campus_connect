import React from 'react';
import { Wallet } from 'lucide-react';

const BudgetTab = ({ 
  newBudget, 
  setNewBudget, 
  handleUpdateBudget, 
  budget, 
  totalExpenses, 
  savings, 
  categories 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-blue-900">Set Monthly Budget</h3>
      <form onSubmit={handleUpdateBudget}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Budget Amount ($)</label>
          <input
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Current budget: <span className="font-bold">${budget.toFixed(2)}</span>
          </p>
          <p className="text-gray-600">
            Current spending: <span className="font-bold">${totalExpenses.toFixed(2)}</span>
          </p>
          <p className={`text-gray-600 ${savings < 0 ? 'text-red-500' : ''}`}>
            Current savings: <span className="font-bold">${savings.toFixed(2)}</span>
          </p>
        </div>

        <div className="mb-6">
          <h4 className="font-bold mb-2">Recommended Category Budgets</h4>
          <div className="space-y-2">
            {categories.map(category => {
              // Typical recommended percentages
              const percentages = {
                'Food': 0.15,
                'Transport': 0.10,
                'Shopping': 0.10,
                'Rent': 0.35,
                'Entertainment': 0.05,
                'Other': 0.25
              };
              const recommendedAmount = (newBudget * percentages[category]).toFixed(2);

              return (
                <div key={category} className="flex justify-between">
                  <span>{category}:</span>
                  <span>${recommendedAmount}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded flex items-center justify-center"
        >
          <Wallet className="mr-2 w-5 h-5" /> Update Budget
        </button>
      </form>
    </div>
  );
};

export default BudgetTab;