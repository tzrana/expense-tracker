import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0.0); // Total balance
  const [income, setIncome] = useState(0.0);  // Total income
  const [expense, setExpense] = useState(0.0); // Total expense

  const [incomeInput, setIncomeInput] = useState(""); // Input for income
  const [expenseInput, setExpenseInput] = useState(""); // Input for expense
  const [transactionName, setTransactionName] = useState(""); // Input for transaction name
  const [transactions, setTransactions] = useState([]); // List of transactions

  // Handle adding income
  function handleIncome() {
    const newIncome = parseFloat(incomeInput); // Convert input to a number
    if (!isNaN(newIncome) && newIncome > 0) { // Validate input
      setIncome(income + newIncome);
      setBalance(balance + newIncome);
      setIncomeInput(""); // Clear the input field
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
    }
  }

  // Handle updating transaction name
  function handleTransaction(e) {
    setTransactionName(e.target.value); // Update the transaction name based on input
  }

  return (
    <>
      <h1>Expense Tracker</h1>

      {/* Display Total Balance */}
      <h2>Your Balance</h2>
      <h2>${balance.toFixed(2)}</h2>

      {/* Income Section */}
      <h4>Income</h4>
      <h2>${income.toFixed(2)}</h2>
      <input
        type="number"
        value={incomeInput}
        onChange={(e) => setIncomeInput(e.target.value)}
        placeholder="Enter income"
      />
      <button onClick={handleIncome}>Set Income</button>

      {/* Expense Section */}
      <h4>Expense</h4>
      <h2>${expense.toFixed(2)}</h2>

      {/* Add New Transaction Section */}
      <div>
        <h3>Add New Transaction</h3>
        <p>Name of Expense</p>
        <input
          type="text"
          value={transactionName}
          onChange={handleTransaction} // Use the handleTransaction function
          placeholder="Enter Item Name"
        />
        <p>Amount</p>
        <input
          type="number"
          value={expenseInput}
          onChange={(e) => setExpenseInput(e.target.value)}
          placeholder="Enter Expense Amount"
        />
        <button onClick={handleExpense}>Submit</button>
      </div>

      {/* Optional: Transaction History */}
      <div>
        <h3>Transaction History</h3>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index}>
              {transaction.name} - ${transaction.amount.toFixed(2)} ({transaction.type})
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
