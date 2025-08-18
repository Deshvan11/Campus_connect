import React, { useState, useEffect } from 'react';
import { ArrowDownAZ, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const TransactionsTab = ({ 
  filteredExpenses, 
  filterCategory, 
  setFilterCategory, 
  setSortOrder, 
  handleDeleteExpense, 
  categories 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedExpenses, setPaginatedExpenses] = useState([]);
  const itemsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  // Update paginated expenses whenever filtered expenses or current page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedExpenses(filteredExpenses.slice(startIndex, endIndex));
  }, [filteredExpenses, currentPage]);

  // Handle page navigation
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-900">All Transactions</h3>
        <div className="flex space-x-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border rounded text-sm"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={() => setSortOrder(prev =>
              prev === 'date-desc' ? 'date-asc' : 'date-desc'
            )}
            className="p-2 border rounded flex items-center"
          >
            <ArrowDownAZ className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left border-b font-semibold text-gray-600">Amount</th>
              <th className="p-3 text-left border-b font-semibold text-gray-600">Category</th>
              <th className="p-3 text-left border-b font-semibold text-gray-600">Date</th>
              <th className="p-3 text-left border-b font-semibold text-gray-600">Notes</th>
              <th className="p-3 text-center border-b font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExpenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-gray-500 text-center py-4">No expenses to show</td>
              </tr>
            ) : (
              paginatedExpenses.map(expense => (
                <tr key={expense.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">${expense.amount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {expense.category}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-500 text-sm">{expense.notes || '—'}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-
            {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} entries
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 border rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center px-3 border rounded">
              <span className="text-sm">{currentPage} of {totalPages}</span>
            </div>
            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 border rounded ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTab;