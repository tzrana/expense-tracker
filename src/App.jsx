import { useState } from "react";
import './app.css';

function App() {
  const [balance, setBalance] = useState(0.0); // Total balance
  const [income, setIncome] = useState(0.0);  // Total income
  const [expense, setExpense] = useState(0.0); // Total expense
  const [incomeInput, setIncomeInput] = useState(""); // Input for income
  const [expenseInput, setExpenseInput] = useState(""); // Input for expense
  const [transactionName, setTransactionName] = useState(""); // Input for transaction name
  const [transactions, setTransactions] = useState([]); // List of transactions
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Handle adding income
  function handleIncome() {
    const newIncome = parseFloat(incomeInput); // Convert input to a number
    if (!isNaN(newIncome) && newIncome > 0) { // Validate input
      setIncome(income + newIncome);
      setBalance(balance + newIncome);
      setIncomeInput(""); // Clear the input field
      setShowIncomeModal(false); // Close the modal after adding income
    }
  }

  // Handle adding expense
  function handleExpense() {
    const newExpense = parseFloat(expenseInput); // Convert input to a number
    if (!isNaN(newExpense) && newExpense > 0 && transactionName.trim() !== "") { // Validate input and name
      setExpense(expense + newExpense);
      setBalance(balance - newExpense);

      // Add transaction to the list
      setTransactions([
        ...transactions,
        { name: transactionName, amount: newExpense, type: "expense" },
      ]);

      setExpenseInput(""); // Clear the input field
      setTransactionName(""); // Clear transaction name input
      setShowExpenseModal(false); // Close the modal after adding expense
    }
  }

  // Handle updating transaction name
  function handleTransaction(e) {
    const value = e.target.value;

    // Regular expression to allow only letters, spaces, and basic punctuation
    const regex = /^[A-Za-z\s'-]*$/;

    if (regex.test(value)) {
      setTransactionName(value); // Update the transaction name if valid
    }
  }

  return (
    <>
    
      <h1>Expense Tracker</h1>
      
      <div className="balance-outer-container">
        <div className="balance-container">
          {/* Display Total Balance */}
          <h2>Current Balance</h2>
          <h2>${balance.toFixed(2)}</h2>
        </div>
      </div>

      <div className="row">
        <div className="column">
          <div className="income-container">
            {/* Income Section */}
            <h3>Income</h3>
            <h4>${income.toFixed(2)}</h4>
            {/* Button to open the income modal */}
            <button onClick={() => setShowIncomeModal(true)}>New Income</button>
          </div>

          <div className="expense-container">
            {/* Expense Section */}
            <h3>Expense</h3>
            <h4 className="expense-color">${expense.toFixed(2)}</h4>
          </div>

        </div>

        <div className="transaction-container">
          <h3>Add New Expenses</h3>
          {/* Button to open the expense modal */}
          <button onClick={() => setShowExpenseModal(true)}>New Expense</button>
          <h3>Expense History</h3>
          
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.name}</td>
                  <td>${transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
         
        </div>
      </div>

      {/* Modal for Income */}
      {showIncomeModal && (
        <Modal
          title="Enter Income Amount"
          value={incomeInput}
          onChange={(e) => setIncomeInput(e.target.value)}
          onSubmit={handleIncome}
          onCancel={() => setShowIncomeModal(false)}
          placeholder="Enter income"
        />
      )}

      {/* Modal for Expense */}
      {showExpenseModal && (
        <Modal
          title="Enter Expense"
          value={expenseInput}
          onChange={(e) => setExpenseInput(e.target.value)}
          onSubmit={handleExpense}
          onCancel={() => setShowExpenseModal(false)}
          placeholder="Enter expense amount"
          extraInput={
            <>
              <input
                type="text"
                value={transactionName}
                onChange={handleTransaction}
                placeholder="Enter Item Name"
              />
            </>
          }
        />
      )}
    </>
  );
}

// Reusable Modal Component
function Modal({ title, value, onChange, onSubmit, onCancel, placeholder, extraInput }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>
        {extraInput}
        <input
          type="number"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <div className="modal-actions">
          <button onClick={onSubmit}>Submit</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default App;
