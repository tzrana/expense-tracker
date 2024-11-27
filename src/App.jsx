import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0.0); // Total balance
  const [income, setIncome] = useState(0.0);  // Total income
  const [expense, setExpense] = useState(0.0); // Total expense

  const [incomeInput, setIncomeInput] = useState(""); // Input for income
  const [expenseInput, setExpenseInput] = useState(""); // Input for expense

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
    if (!isNaN(newExpense) && newExpense > 0) { // Validate input
      setExpense(expense + newExpense);
      setBalance(balance - newExpense);
      setExpenseInput(""); // Clear the input field
    }
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
      <button onClick={handleIncome}>Add Income</button>

      {/* Expense Section */}
      <h4>Expense</h4>
      <h2>${expense.toFixed(2)}</h2>
      <input
        type="number"
        value={expenseInput}
        onChange={(e) => setExpenseInput(e.target.value)}
        placeholder="Enter expense"
      />
      <button onClick={handleExpense}>Add Expense</button>








      {/* Optional: Add New Transaction Section */}
      <div>
        <h3>Add New Transaction</h3>
        <p>Name of Expense</p>
        <input type="text" placeholder="Enter transaction name" />
        <p>Amount</p>
        <input type="number" placeholder="Enter transaction amount" />
        <button>Submit</button>
      </div>
    </> 
  );
}

export default App;
