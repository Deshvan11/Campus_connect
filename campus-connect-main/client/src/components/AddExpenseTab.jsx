import React from 'react';
import { Plus } from 'lucide-react';

const AddExpenseTab = ({ newExpense, setNewExpense, handleAddExpense, categories }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-blue-900">Add New Expense</h3>
      <form onSubmit={handleAddExpense}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Amount ($)</label>
          <input
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Category</label>
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Notes</label>
          <textarea
            value={newExpense.notes}
            onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Add any notes about this expense"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded flex items-center justify-center"
        >
          <Plus className="mr-2 w-5 h-5" /> Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpenseTab;