import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Plus, ArrowDownAZ, BarChart, ListFilter, CreditCard, Wallet, PieChart } from 'lucide-react';
import Navbar from '../components/Navbar';
import TransactionsTab from '../components/TransactionTab';
import ReportsTab from '../components/ReportsTab';
import AddExpenseTab from '../components/AddExpenseTab';
import BudgetTab from '../components/BudgetTabComponent';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`; // Replace with your actual API URL

const BudgetBuddy = () => {
    const [budget, setBudget] = useState(0);
    const [expenses, setExpenses] = useState([
    ]);
    const [newExpense, setNewExpense] = useState({ amount: '', category: 'Food', date: '', notes: '' });
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [savings, setSavings] = useState(0);
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortOrder, setSortOrder] = useState('date-desc');
    const [newBudget, setNewBudget] = useState(budget);
    const [activeTab, setActiveTab] = useState('transactions'); // Default tab

    const categories = ['Food', 'Transport', 'Shopping', 'Rent', 'Entertainment', 'Other'];

    useEffect(() => {
        const fetchBudgetAndExpenses = async () => {
            try {
                const budgetResponse = await axios.get(`${API_URL}/budget/${localStorage.getItem('userId')}`);
                const expensesResponse = await axios.get(`${API_URL}/expenses/${localStorage.getItem('userId')}`);
                setBudget(budgetResponse.data.budget);
                setExpenses(expensesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchBudgetAndExpenses();
    }, []);

    // Calculate totals whenever expenses or budget changes
    useEffect(() => {
        const sum = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
        setTotalExpenses(sum);
        setSavings(budget - sum);
    }, [expenses, budget]);

    // Add new expense
    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!newExpense.amount || !newExpense.category || !newExpense.date) return;

        try {
            const response = await axios.post(`${API_URL}/expenses`, {
                userId: localStorage.getItem('userId'),
                amount: parseFloat(newExpense.amount),
                category: newExpense.category,
                date: newExpense.date,
                notes: newExpense.notes,
            });

            setExpenses([response.data, ...expenses]); // Add new expense to the list
            setNewExpense({ amount: '', category: '', date: '', notes: '' });
            setActiveTab('transactions'); // Switch to transactions tab
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    // Delete expense
    const handleDeleteExpense = async (id) => {
        try {
            await axios.delete(`${API_URL}/expenses/${id}`);
            setExpenses(expenses.filter(expense => expense._id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    // Update budget
    const handleUpdateBudget = async (e) => {
        e.preventDefault();
        if (!newBudget) return;

        try {
            const userId = localStorage.getItem('userId');
            await axios.put(`${API_URL}/budget/${userId}`, { budget: parseFloat(newBudget) });
            setBudget(parseFloat(newBudget));
            setActiveTab('transactions'); // Switch to transactions tab
        } catch (error) {
            console.error('Error updating budget:', error);
        }
    };

    // Filter and sort expenses
    const filteredExpenses = expenses
        .filter(expense => filterCategory === 'All' ? true : expense.category === filterCategory)
        .sort((a, b) => {
            if (sortOrder === 'amount-asc') return a.amount - b.amount;
            if (sortOrder === 'amount-desc') return b.amount - a.amount;
            if (sortOrder === 'date-asc') return new Date(a.date) - new Date(b.date);
            return new Date(b.date) - new Date(a.date); // date-desc default
        });

    // Calculate category totals for the summary and reports
    const categoryTotals = categories.map(category => {
        const total = expenses
            .filter(expense => expense.category === category)
            .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        return { category, value: total, total, percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0 };
    }).filter(item => item.total > 0);

    return (
        <div className="min-h-screen bg-gray-50 mb-28">
            {/* Header */}
            <Navbar />

            {/* Main Title Section */}
            <section className="bg-blue-900 text-white py-12 px-4">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-3">Budget Buddy</h2>
                    <p className="text-xl">Track Your Expenses Smartly</p>
                    <p className="text-xl mb-8">AI-powered budgeting assistant for students</p>

                    {/* Budget Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-blue-800 p-6 rounded-lg shadow-lg">
                            <DollarSign className="mx-auto mb-2 w-8 h-8" />
                            <h3 className="text-lg">Total Expenses</h3>
                            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
                        </div>
                        <div className="bg-blue-800 p-6 rounded-lg shadow-lg">
                            <PieChart className="mx-auto mb-2 w-8 h-8" />
                            <h3 className="text-lg">Monthly Budget</h3>
                            <p className="text-2xl font-bold">${budget.toFixed(2)}</p>
                        </div>
                        <div className="bg-blue-800 p-6 rounded-lg shadow-lg">
                            <TrendingUp className="mx-auto mb-2 w-8 h-8" />
                            <h3 className="text-lg">Savings</h3>
                            <p className={`text-2xl font-bold ${savings < 0 ? 'text-red-400' : ''}`}>
                                ${savings.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tab navigation */}
            <div className="container mx-auto mt-10 px-4 md:px-10 lg:px-32">
                <div className="flex overflow-x-auto">
                    <button
                        className={`px-4 py-2 font-medium rounded-t-lg flex items-center ${activeTab === 'transactions'
                                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                        onClick={() => setActiveTab('transactions')}
                    >
                        <ListFilter className="w-5 h-5 mr-2" />
                        All Transactions
                    </button>
                    <button
                        className={`px-4 py-2 font-medium rounded-t-lg flex items-center ${activeTab === 'reports'
                                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                        onClick={() => setActiveTab('reports')}
                    >
                        <BarChart className="w-5 h-5 mr-2" />
                        Reports
                    </button>
                    <button
                        className={`px-4 py-2 font-medium rounded-t-lg flex items-center ${activeTab === 'add'
                                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                        onClick={() => setActiveTab('add')}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Expense
                    </button>
                    <button
                        className={`px-4 py-2 font-medium rounded-t-lg flex items-center ${activeTab === 'budget'
                                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                        onClick={() => setActiveTab('budget')}
                    >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Budget
                    </button>
                </div>

                {/* Tab content */}
                <div className="bg-white border border-gray-200 rounded-b-lg shadow-md">
                    {activeTab === 'transactions' && (
                        <TransactionsTab 
                            filteredExpenses={filteredExpenses}
                            filterCategory={filterCategory}
                            setFilterCategory={setFilterCategory}
                            setSortOrder={setSortOrder}
                            handleDeleteExpense={handleDeleteExpense}
                            categories={categories}
                        />
                    )}
                    {activeTab === 'reports' && (
                        <ReportsTab 
                            categoryTotals={categoryTotals}
                            totalExpenses={totalExpenses}
                            budget={budget}
                        />
                    )}
                    {activeTab === 'add' && (
                        <AddExpenseTab 
                            newExpense={newExpense}
                            setNewExpense={setNewExpense}
                            handleAddExpense={handleAddExpense}
                            categories={categories}
                        />
                    )}
                    {activeTab === 'budget' && (
                        <BudgetTab 
                            newBudget={newBudget}
                            setNewBudget={setNewBudget}
                            handleUpdateBudget={handleUpdateBudget}
                            budget={budget}
                            totalExpenses={totalExpenses}
                            savings={savings}
                            categories={categories}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BudgetBuddy;