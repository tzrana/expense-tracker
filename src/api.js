// GET, POST, PUT, PATCH, DELETE

// GET - http:localhost:3000/transactions returns []
// GET - http:localhost:3000/transactions/1 return {}
// POST - http:localhost:3000/transactions body { type: "expense", title: "snacks", amount: 20 }
// DELETE - http:localhost:3000/transactions/1
// PUT - http:localhost:3000/transactions/1 body { type: "expense", title: "snacks", amount: 20 }


export function getTransactions() {
    return fetch('http://localhost:3000/transactions', { method: "GET" }) // Replace this with your actual JSON URL
      .then((response) => response.json())
      .then((data) => data);
}

export function addTransaction(payload) {
    return fetch('http://localhost:3000/transactions', {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }) // Replace this with your actual JSON URL
      .then((response) => response.json())
      .then((data) => data);
}

export function deleteTransaction(id){
    return fetch(`http://localhost:3000/transactions/${id}`, { method: "DELETE" }) // Replace this with your actual JSON URL
      .then((response) => response.json())
      .then((data) => data);
}

export function editTransaction(id, updatedTransaction) {
    return fetch(`http://localhost:3000/transactions/${id}`, {
      method: "PUT", // Use PUT or PATCH as appropriate
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTransaction), // Send the updated transaction data
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update transaction");
        }
        return response.json();
      })
      .then((data) => data);
  }