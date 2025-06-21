let chart;

function updateChart() {
  const totals = {};

  expenses.forEach((exp) => {
    if (!totals[exp.category]) {
      totals[exp.category] = 0;
    }
    totals[exp.category] += exp.amount;
  });

  const labels = Object.keys(totals);
  const data = Object.values(totals);

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("expenseChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        label: "Spending by Category",
        data,
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40"
        ]
      }]
    }
  });
}
