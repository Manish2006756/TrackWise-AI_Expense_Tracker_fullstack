let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
renderExpenses();
updateChart();

function addExpense() {
  const title = document.getElementById("title").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!title || !amount || !category) {
    alert("Please fill all fields");
    return;
  }

  const newExpense = {
    title,
    amount,
    category,
    date: new Date().toLocaleDateString()
  };

  expenses.push(newExpense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  renderExpenses();
  updateChart();

  // Reset form
  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "Food";
}

function renderExpenses() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  expenses.forEach((exp, index) => {
    const item = document.createElement("div");
    item.className = "expense-item";
    item.innerHTML = `
      <strong>${exp.title}</strong> – ₹${exp.amount}<br />
      ${exp.category} | ${exp.date}<br />
      <button onclick="deleteExpense(${index})">Delete</button>
    `;
    list.appendChild(item);
  });
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  updateChart();
}
