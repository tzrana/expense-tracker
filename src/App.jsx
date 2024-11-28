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

  // Handle adding income
  function handleIncome() {
    const newIncome = parseFloat(incomeInput); // Convert input to a number
    if (!isNaN(newIncome) && newIncome > 0) { // Validate input
      setIncome(income + newIncome);
      setBalance(balance + newIncome);
      setIncomeInput(""); // Clear the input field

       // Hide the input section after setting income
    var x = document.getElementById("show-input-income");
    x.style.display = "none";
    }
  }

  // Toggle visibility of income input section
  function showIncome() {
    var x = document.getElementById("show-input-income");
    x.style.display = "block";
  }

  // Toggle visibility of expense input section
  function showTransaction() {
    var y = document.getElementById("show-transaction");
    y.style.display = "block";
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

      // Hide the input section after setting income
      var x = document.getElementById("show-transaction");
      x.style.display = "none";
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

      <div className="balance-container">
        {/* Display Total Balance */}
        <h2>Your Balance</h2>
        <h2>${balance.toFixed(2)}</h2>
      </div>

      <div className="row">
        <div className="column">
          <div className="income-container">
            {/* Income Section */}
            <h3>Income</h3>
            <h4>${income.toFixed(2)}</h4>

            {/* Income input and set button */}
            <div className="show-button-input" id="show-input-income" >
              <input
                type="number"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                placeholder="Enter income"
              />
              
              <button onClick={handleIncome}>Set Income</button>
            </div>

            <button onClick={showIncome}>Add Amount</button>
          </div>

          {/* Expense Section */}
          <div className="expense-container" >
            <h3>Expense</h3>
            <h4 className="expense-color">${expense.toFixed(2)}</h4>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="transaction-container">
          {/* Add New Transaction Section */}
          <div className="show-transaction-button" id="show-transaction" >
            <h3>Add New Transaction</h3>
            <p>Name of Expense</p>
            <input
              type="text"
              value={transactionName}
              onChange={handleTransaction}
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
          <button onClick={showTransaction}>Add Expense</button>

          <h3>Transaction History</h3>
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
                  <td>${transaction.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
