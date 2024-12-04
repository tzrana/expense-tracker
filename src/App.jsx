import { useEffect, useState } from "react";
import { addTransaction, getTransactions, deleteTransaction, editTransaction } from "./api";
// import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'

import './app.css';

function App() {
  const [balance, setBalance] = useState(0.0);
  const [income, setIncome] = useState(0.0);
  const [expense, setExpense] = useState(0.0);
  const [incomeInput, setIncomeInput] = useState("");
  const [expenseInput, setExpenseInput] = useState("");
  const [transactionName, setTransactionName] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const balanceColor = balance < 100 ? 'text-red-500' : 'text-blue-900';
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTransactionData, setEditTransactionData] = useState(null);
  const [filter, setFilter] = useState('all');



  function calculateTransactions(data) {
    const initialBalance = data.reduce((total, transaction) => {
      if (transaction.type === "income") {
        return total + transaction.amount;
      } else if (transaction.type === "expense") {
        return total - transaction.amount;
      }
      return total;
    }, 0);

    const initialIncome = data.filter(transaction => transaction.type === "income").reduce((total, transaction) => total + transaction.amount, 0);
    const initialExpense = data.filter(transaction => transaction.type === "expense").reduce((total, transaction) => total + transaction.amount, 0);

    setBalance(initialBalance);
    setIncome(initialIncome);
    setExpense(initialExpense);
  }

  useEffect(() => {
    getTransactions().then(data => {
      setTransactions(data);
      calculateTransactions(data); // Call calculateTransactions with the fetched data
    });
  }, []);

  function removeTransaction(transactionId) {
    deleteTransaction(transactionId)
      .then(() => {
        const updatedTransactions = transactions.filter(t => t.id !== transactionId);
        setTransactions(updatedTransactions); // Update state with remaining transactions
        calculateTransactions(updatedTransactions); // Recalculate after deletion
      })
      .catch(error => {
        console.error("Error deleting transaction:", error);
        alert("Failed to delete transaction.");
      });
  }

  function updateTransaction(transactionId) {
    const transactionToEdit = transactions.find((t) => t.id === transactionId);
    if (!transactionToEdit) {
      alert("Transaction not found.");
      return;
    }

    setEditTransactionData(transactionToEdit); // Populate modal with transaction data
    setShowEditModal(true); // Show the modal
  }



  function handleUpdateTransaction() {
    const { id, name, amount } = editTransactionData;

    // Validate inputs
    if (!name.trim()) {
      alert("Transaction name cannot be empty.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const updatedTransaction = {
      ...editTransactionData,
      name: name.trim(),
      amount: parseFloat(amount),
    };

    // Call API to edit the transaction
    editTransaction(id, updatedTransaction)
      .then((updatedData) => {
        // Update the transaction in the state
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.id === id ? { ...transaction, ...updatedData } : transaction
          )
        );

        // Recalculate balances
        calculateTransactions(
          transactions.map((transaction) =>
            transaction.id === id ? { ...transaction, ...updatedData } : transaction
          )
        );

        // Close the modal
        setShowEditModal(false);
        setEditTransactionData(null);

        alert("Transaction updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating transaction:", error);
        alert("Failed to update transaction.");
      });
  }

  function handleIncome() {
    const newIncome = parseFloat(incomeInput);
    if (!isNaN(newIncome) && newIncome > 0) {
      const newTransaction = { name: transactionName, amount: newIncome, type: "income" };
      addTransaction(newTransaction)
        .then(() => {
          const updatedTransactions = [...transactions, newTransaction];
          setTransactions(updatedTransactions);
          calculateTransactions(updatedTransactions);
        })
        .catch(error => {
          console.error("Error adding income:", error);
          alert("Failed to add income.");
        });

      setIncomeInput("");
      setTransactionName("");
      setShowIncomeModal(false);
    }
  }

  function handleExpense() {
    const newExpense = parseFloat(expenseInput);
    if (!isNaN(newExpense) && newExpense > 0 && transactionName.trim() !== "") {
      if (newExpense > balance) {
        alert("Low Remaining balance.");
        return;
      }

      const newTransaction = { name: transactionName, amount: newExpense, type: "expense" };
      addTransaction(newTransaction)
        .then(() => {
          const updatedTransactions = [...transactions, newTransaction];
          setTransactions(updatedTransactions);
          calculateTransactions(updatedTransactions);
        })
        .catch(error => {
          console.error("Error adding expense:", error);
          alert("Failed to add expense.");
        });

      setExpenseInput("");
      setTransactionName("");
      setShowExpenseModal(false);
    }
  }

  function handleTransaction(e) {
    const value = e.target.value;
    const regex = /^[A-Za-z\s'-]*$/;
    if (regex.test(value)) {
      setTransactionName(value);
    }
  }


  // Filtered transactions based on the selected filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true; // Show all transactions
    return transaction.type === filter; // Show only income or expense
  });


  return (
    <>
      <div className="text-4xl sm:text-5xl lg:text-6xl text-center text-teal-400 my-4 sm:my-6 lg:mt-2">
      <h1>Expense Tracker</h1>
    </div>
    <div className="flex flex-wrap gap-4 sm:gap-6 justify-center mb-8 px-4 sm:px-6 lg:px-8">
      <div className="flex-1 bg-white border border-gray-300 rounded-lg shadow-md p-4 sm:p-6 min-h-[8rem] sm:min-h-[10rem] max-h-[12rem] flex flex-col items-center">
        <h2 className="text-lg sm:text-xl font-bold mb-2">Current Balance</h2>
        <h3 className={`${balanceColor} font-bold text-lg sm:text-xl`}>${balance.toFixed(2)}</h3>
      </div>
      <div className="flex-1 bg-white border border-gray-300 rounded-lg shadow-md p-4 sm:p-6 min-h-[8rem] sm:min-h-[10rem] max-h-[12rem] flex flex-col items-center">
        <h2 className="text-lg sm:text-xl font-bold mb-2">Expense</h2>
        <h3 className="text-red-500 font-bold text-lg sm:text-xl">${expense.toFixed(2)}</h3>
      </div>
      <div className="flex-1 bg-white border border-gray-300 rounded-lg shadow-md p-4 sm:p-6 min-h-[8rem] sm:min-h-[10rem] max-h-[12rem] flex flex-col items-center">
        <h2 className="text-lg sm:text-xl font-bold mb-2">Income</h2>
        <h3 className="text-green-500 font-bold text-lg sm:text-xl">${income.toFixed(2)}</h3>
      </div>
    </div>

    <div className="flex justify-center px-4 sm:px-6 lg:px-8 pb-4">
      <div className="bg-gray-200 border border-gray-400 rounded-lg shadow-md  md:w-auto p-4 sm:p-6 w-full sm:w-3/4 lg:w-1/2">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">Add New Amount</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => setShowExpenseModal(true)}
            className="bg-red-400 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700"
          >
            New Expense
          </button>
          <button
            onClick={() => setShowIncomeModal(true)}
            className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            New Income
          </button>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-center mb-4">Expense History</h3>
        <table className="table-auto w-full border-separate">
          <thead>
            <tr>
              <th className="bg-gray-300 p-2 text-xs sm:text-sm">Name</th>
              <th className="bg-gray-300 p-2 text-xs sm:text-sm">Amount</th>
              <th className="bg-gray-300 p-2 text-xs sm:text-sm">Tags</th>
              <th className="bg-gray-300 p-2 text-xs sm:text-sm">Delete</th>
              <th className="bg-gray-300 p-2 text-xs sm:text-sm">Edit</th>
              <th className="bg-gray-300 p-2 text-xs sm:text-sm">
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-6 py-1 rounded border text-xs border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-2 uppercase text-xs sm:text-sm">{transaction.name}</td>
                <td className="p-2 text-xs sm:text-sm">${transaction.amount}</td>
                <td className="p-2">
                  {transaction.type === "income" ? (
                    <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-300">
                      Income
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-300">
                      Expense
                    </span>
                  )}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => removeTransaction(transaction.id)}
                    className="bg-red-400 text-white px-4 py-1 rounded-full hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
                <td className="p-2 uppercase">
                  <button
                    onClick={() => updateTransaction(transaction.id)}
                    className="bg-cyan-500 text-white px-4 py-1 rounded-full hover:bg-cyan-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {showIncomeModal && (
        <Modal
          title="Enter Income Amount"
          value={incomeInput}
          onChange={(e) => setIncomeInput(e.target.value)}
          onSubmit={handleIncome}
          onCancel={() => {
            setShowIncomeModal(false);
            setIncomeInput("");
            setTransactionName("");
          }}
          placeholder="Enter Income Amount"
          extraInput={
            <input
              type="text"
              value={transactionName}
              onChange={handleTransaction}
              placeholder="Enter Income Name"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4 "
            />
          }
        />
      )}

      {showExpenseModal && balance > 0 && (
        <Modal
          title="Enter Expense"
          value={expenseInput}
          onChange={(e) => setExpenseInput(e.target.value)}
          onSubmit={handleExpense}
          onCancel={() => {
            setShowExpenseModal(false);
            setExpenseInput("");
            setTransactionName("");
          }}
          placeholder="Enter Expense Amount"
          extraInput={
            <input
              type="text"
              value={transactionName}
              onChange={handleTransaction}
              placeholder="Enter Item Name"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            />
          }
        />
      )}

      {showEditModal && editTransactionData && (
        <Modal
          title="Edit Transaction"
          value={editTransactionData.amount}
          onChange={(e) =>
            setEditTransactionData((prev) => ({ ...prev, amount: e.target.value }))
          }
          onSubmit={handleUpdateTransaction}
          onCancel={() => {
            setShowEditModal(false);
            setEditTransactionData(null);
          }}
          placeholder="Enter New Amount"
          extraInput={
            <input
              type="text"
              value={editTransactionData.name}
              onChange={(e) =>
                setEditTransactionData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter New Name"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            />
          }
        />
      )}
    </>
  );
}

function Modal({ title, value, onChange, onSubmit, onCancel, placeholder, extraInput }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
        {extraInput}
        <input
          type="number"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />
        <div className="flex justify-center">
          <button onClick={onSubmit} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Submit
          </button>
          <button onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
