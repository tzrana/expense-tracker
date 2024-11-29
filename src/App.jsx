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
  const balanceColor = balance < 100 ? 'red' : 'darkblue';

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
      if (newExpense > balance) {
        alert("Low Remaining balance.");
        return;
      }
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
      <div className="title">
        <h1>Expense Tracker</h1>
      </div>
      <div className="row-1">
        {/* Balance Section */}
        <div className="col">
          <div className="balance-container">
            <h2>Current Balance</h2>
            <h3 style={{ color: balanceColor }}>${balance.toFixed(2)}</h3>
          </div>
        </div>

        {/* Expense Section */}
        <div className="col">
          <div className="expense-container">
            <h2>Expense</h2>
            <h3 className="expense-color">${expense.toFixed(2)}</h3>
          </div>
        </div>

        {/* Income Section */}
        <div className="col">
          <div className="income-container">
            <h2>Income</h2>
            <h3>${income.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="row-2">

        <div className="transaction-container">
          <h3>Add New Amount</h3>
          {/* Button to open the expense/income modal */}
          <button onClick={() => setShowExpenseModal(true)}>New Expense</button>
          <button onClick={() => setShowIncomeModal(true)}>New Income</button>
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
          onCancel={() => {setShowIncomeModal(false); setIncomeInput("");}}
          placeholder="Enter income"
        />
      )}

      {/* Modal for Expense */}
      {showExpenseModal && balance > 0 && (
        <Modal
          title="Enter Expense"
          value={expenseInput}
          onChange={(e) => setExpenseInput(e.target.value)}
          onSubmit={handleExpense}
          onCancel={() => {setShowExpenseModal(false); setExpenseInput(""); setTransactionName("");}}
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
