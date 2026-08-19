
// ======================================
// TrackWise Frontend
// ======================================

const API_URL =
  'https://trackwise-ai-expense-tracker-fullstack-1.onrender.com/api/transactions';

const AUTH_URL =
  'https://trackwise-ai-expense-tracker-fullstack-1.onrender.com/api/auth';

let expenseChart = null;
let allTransactions = [];


// ======================================
// Authentication
// ======================================

let token =
  localStorage.getItem('trackwise_token');

let currentUser = null;

try {
  currentUser =
    JSON.parse(
      localStorage.getItem('trackwise_user')
    );
} catch (err) {
  currentUser = null;
}


// ======================================
// DOM Elements
// ======================================

const authScreen =
  document.getElementById('authScreen');

const app =
  document.getElementById('app');

const loginForm =
  document.getElementById('loginForm');

const registerForm =
  document.getElementById('registerForm');

const loginEmail =
  document.getElementById('loginEmail');

const loginPassword =
  document.getElementById('loginPassword');

const registerName =
  document.getElementById('registerName');

const registerEmail =
  document.getElementById('registerEmail');

const registerPassword =
  document.getElementById('registerPassword');

const loginBtn =
  document.getElementById('loginBtn');

const registerBtn =
  document.getElementById('registerBtn');

const loginMessage =
  document.getElementById('loginMessage');

const registerMessage =
  document.getElementById('registerMessage');

const showRegister =
  document.getElementById('showRegister');

const showLogin =
  document.getElementById('showLogin');

const logoutBtn =
  document.getElementById('logoutBtn');

const welcomeUser =
  document.getElementById('welcomeUser');

const txForm =
  document.getElementById('txForm');

const descInput =
  document.getElementById('desc');

const amountInput =
  document.getElementById('amount');

const submitBtn =
  document.getElementById('submitBtn');

const txList =
  document.getElementById('txList');

const aiInsight =
  document.getElementById('aiInsight');

const insightBtn =
  document.getElementById('insightBtn');

const totalSpent =
  document.getElementById('totalSpent');

const transactionCount =
  document.getElementById('transactionCount');

const averageExpense =
  document.getElementById('averageExpense');

const monthlyTotal =
  document.getElementById('monthlyTotal');

const categorySummary =
  document.getElementById('categorySummary');

const searchInput =
  document.getElementById('searchInput');

const categoryFilter =
  document.getElementById('categoryFilter');


// ======================================
// Show Application
// ======================================

function showApp() {

  authScreen.classList.add('hidden');

  app.classList.remove('hidden');

  if (currentUser) {

    welcomeUser.textContent =
      `Hi, ${currentUser.name}`;

  }

  fetchTransactions();

}


// ======================================
// Show Authentication
// ======================================

function showAuth() {

  authScreen.classList.remove('hidden');

  app.classList.add('hidden');

}


// ======================================
// Logout
// ======================================

function logout() {

  // Remove saved authentication data
  localStorage.removeItem(
    'trackwise_token'
  );

  localStorage.removeItem(
    'trackwise_user'
  );


  // Clear current session
  token = null;

  currentUser = null;


  // Clear username from header
  if (welcomeUser) {

    welcomeUser.textContent = '';

  }


  // Clear transactions
  allTransactions = [];


  // Destroy chart
  if (expenseChart) {

    expenseChart.destroy();

    expenseChart = null;

  }


  // Clear transaction list
  if (txList) {

    txList.innerHTML = '';

  }


  // Reset dashboard statistics
  if (totalSpent) {

    totalSpent.textContent =
      '$0.00';

  }


  if (transactionCount) {

    transactionCount.textContent =
      '0';

  }


  if (averageExpense) {

    averageExpense.textContent =
      '$0.00';

  }


  if (monthlyTotal) {

    monthlyTotal.textContent =
      '$0.00';

  }


  // Clear category summary
  if (categorySummary) {

    categorySummary.innerHTML = '';

  }


  // Reset AI insight
  if (aiInsight) {

    aiInsight.textContent =
      'Click the button to analyze your spending.';

  }


  // Clear login fields
  if (loginEmail) {

    loginEmail.value = '';

  }


  if (loginPassword) {

    loginPassword.value = '';

  }


  // Clear messages
  if (loginMessage) {

    loginMessage.textContent = '';

  }


  if (registerMessage) {

    registerMessage.textContent = '';

  }


  // Make sure login form is visible
  if (loginForm && registerForm) {

    registerForm.classList.add('hidden');

    loginForm.classList.remove('hidden');

  }


  // Show login screen
  showAuth();

}


// ======================================
// Logout Button
// ======================================

logoutBtn.addEventListener(
  'click',
  logout
);


// ======================================
// Authenticated Request Headers
// ======================================

function authHeaders() {

  return {

    'Content-Type':
      'application/json',

    'Authorization':
      `Bearer ${token}`

  };

}


// ======================================
// Register
// ======================================

registerBtn.addEventListener(
  'click',
  async () => {

    const name =
      registerName.value.trim();

    const email =
      registerEmail.value.trim();

    const password =
      registerPassword.value;


    if (!name || !email || !password) {

      registerMessage.textContent =
        'Please fill all fields.';

      return;

    }


    registerBtn.disabled = true;

    registerBtn.textContent =
      'Creating Account...';


    try {

      const res =
        await fetch(
          `${AUTH_URL}/register`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              name,
              email,
              password
            })
          }
        );


      const data =
        await res.json();


      if (!res.ok) {

        throw new Error(
          data.error ||
          'Registration failed'
        );

      }


      registerMessage.textContent =
        'Account created! You can now login.';


      registerName.value = '';

      registerEmail.value = '';

      registerPassword.value = '';


      // Switch to login
      registerForm.classList.add('hidden');

      loginForm.classList.remove('hidden');

      loginEmail.value = email;


    } catch (err) {

      console.error(
        'Registration Error:',
        err
      );

      registerMessage.textContent =
        err.message;


    } finally {

      registerBtn.disabled = false;

      registerBtn.textContent =
        'Create Account';

    }

  }
);


// ======================================
// Login
// ======================================

loginBtn.addEventListener(
  'click',
  async () => {

    const email =
      loginEmail.value.trim();

    const password =
      loginPassword.value;


    if (!email || !password) {

      loginMessage.textContent =
        'Please enter email and password.';

      return;

    }


    loginBtn.disabled = true;

    loginBtn.textContent =
      'Logging in...';


    try {

      console.log(
        'Attempting login:',
        email
      );


      const res =
        await fetch(
          `${AUTH_URL}/login`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              email,
              password
            })
          }
        );


      const data =
        await res.json();


      console.log(
        'Login response:',
        res.status,
        data
      );


      if (!res.ok) {

        throw new Error(
          data.error ||
          'Login failed'
        );

      }


      if (!data.token || !data.user) {

        throw new Error(
          'Invalid login response from server'
        );

      }


      // Store authentication
      token =
        data.token;

      currentUser =
        data.user;


      localStorage.setItem(
        'trackwise_token',
        token
      );

      localStorage.setItem(
        'trackwise_user',
        JSON.stringify(currentUser)
      );


      loginEmail.value = '';

      loginPassword.value = '';

      loginMessage.textContent = '';


      // Show dashboard
      showApp();


    } catch (err) {

      console.error(
        'Login Error:',
        err
      );

      loginMessage.textContent =
        err.message ||
        'Unable to login.';


    } finally {

      loginBtn.disabled = false;

      loginBtn.textContent =
        'Login';

    }

  }
);


// ======================================
// Switch Login / Register
// ======================================

showRegister.addEventListener(
  'click',
  () => {

    loginForm.classList.add('hidden');

    registerForm.classList.remove('hidden');

    loginMessage.textContent = '';

  }
);


showLogin.addEventListener(
  'click',
  () => {

    registerForm.classList.add('hidden');

    loginForm.classList.remove('hidden');

    registerMessage.textContent = '';

  }
);


// ======================================
// Get AI Spending Insight
// ======================================

async function getAIInsight() {

  if (!token) {

    logout();

    return;

  }


  insightBtn.disabled = true;

  insightBtn.textContent =
    '🤖 Analyzing...';

  aiInsight.textContent =
    'Analyzing your spending patterns...';


  try {

    const res =
      await fetch(
        `${API_URL}/insights`,
        {
          method: 'GET',

          headers: {
            'Authorization':
              `Bearer ${token}`
          }
        }
      );


    if (res.status === 401) {

      logout();

      return;

    }


    if (!res.ok) {

      throw new Error(
        'Failed to generate insight'
      );

    }


    const data =
      await res.json();


    aiInsight.textContent =
      data.insight;


  } catch (err) {

    console.error(
      'AI Insight Error:',
      err
    );

    aiInsight.textContent =
      'Unable to generate insights right now.';


  } finally {

    insightBtn.disabled = false;

    insightBtn.textContent =
      '✨ Get AI Insight';

  }

}


// ======================================
// Fetch Transactions
// ======================================

async function fetchTransactions() {

  if (!token) {

    logout();

    return;

  }


  try {

    const res =
      await fetch(
        API_URL,
        {
          method: 'GET',

          headers: {
            'Authorization':
              `Bearer ${token}`
          }
        }
      );


    if (res.status === 401) {

      logout();

      return;

    }


    if (!res.ok) {

      throw new Error(
        'Failed to fetch transactions'
      );

    }


    const transactions =
      await res.json();


    allTransactions =
      transactions;


    renderTransactions(
      allTransactions
    );


    updateStatistics(
      allTransactions
    );


    updateMonthlySummary(
      allTransactions
    );


    updateChart(
      allTransactions
    );


  } catch (err) {

    console.error(
      'Error fetching transactions:',
      err
    );

  }

}


// ======================================
// Render Transactions
// ======================================

function renderTransactions(
  transactions
) {

  txList.innerHTML = '';


  if (transactions.length === 0) {

    txList.innerHTML = `
      <li class="empty-state">
        No transactions found.
      </li>
    `;

    return;

  }


  transactions.forEach(tx => {

    const li =
      document.createElement('li');


    li.className =
      'tx-item';


    const formattedDate =
      new Date(
        tx.date
      ).toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }
      );


    li.innerHTML = `

      <div class="tx-info">

        <span class="tx-desc">
          ${escapeHtml(tx.description)}
        </span>

        <div class="tx-meta">

          <span class="tx-category">
            ${escapeHtml(tx.category)}
          </span>

          <span class="tx-date">
            ${formattedDate}
          </span>

        </div>

      </div>


      <div class="tx-actions">

        <span class="tx-amount">
          $${Number(tx.amount).toFixed(2)}
        </span>

        <button
          class="delete-btn"
          onclick="deleteTransaction('${tx._id}')"
          aria-label="Delete transaction"
        >
          ✕
        </button>

      </div>

    `;


    txList.appendChild(li);

  });

}


// ======================================
// Monthly Summary
// ======================================

function updateMonthlySummary(
  transactions
) {

  const now =
    new Date();


  const currentMonth =
    now.getMonth();


  const currentYear =
    now.getFullYear();


  const monthlyTransactions =
    transactions.filter(tx => {

      const date =
        new Date(tx.date);


      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );

    });


  const total =
    monthlyTransactions.reduce(
      (sum, tx) => {

        return sum +
          Number(tx.amount);

      },
      0
    );


  monthlyTotal.textContent =
    `$${total.toFixed(2)}`;


  const categoryTotals = {};


  monthlyTransactions.forEach(tx => {

    categoryTotals[tx.category] =
      (
        categoryTotals[tx.category] ||
        0
      ) +
      Number(tx.amount);

  });


  categorySummary.innerHTML = '';


  if (
    monthlyTransactions.length === 0
  ) {

    categorySummary.innerHTML = `
      <p class="summary-empty">
        No spending recorded this month.
      </p>
    `;

    return;

  }


  Object.entries(categoryTotals)
    .sort(
      (a, b) => b[1] - a[1]
    )
    .forEach(
      ([category, amount]) => {

        const row =
          document.createElement(
            'div'
          );


        row.className =
          'category-summary-item';


        row.innerHTML = `

          <div class="category-summary-info">

            <span class="category-summary-name">
              ${escapeHtml(category)}
            </span>

            <span class="category-summary-amount">
              $${amount.toFixed(2)}
            </span>

          </div>

        `;


        categorySummary.appendChild(
          row
        );

      }
    );

}


// ======================================
// Dashboard Statistics
// ======================================

function updateStatistics(
  transactions
) {

  const total =
    transactions.reduce(
      (sum, transaction) => {

        return sum +
          Number(
            transaction.amount
          );

      },
      0
    );


  const count =
    transactions.length;


  const average =
    count > 0
      ? total / count
      : 0;


  totalSpent.textContent =
    `$${total.toFixed(2)}`;


  transactionCount.textContent =
    count;


  averageExpense.textContent =
    `$${average.toFixed(2)}`;

}


// ======================================
// Chart
// ======================================

function updateChart(
  transactions
) {

  const categoryTotals = {};


  transactions.forEach(tx => {

    categoryTotals[tx.category] =
      (
        categoryTotals[tx.category] ||
        0
      ) +
      Number(tx.amount);

  });


  const labels =
    Object.keys(
      categoryTotals
    );


  const data =
    Object.values(
      categoryTotals
    );


  const canvas =
    document.getElementById(
      'expenseChart'
    );


  if (!canvas) {

    return;

  }


  const ctx =
    canvas.getContext('2d');


  if (expenseChart) {

    expenseChart.destroy();

    expenseChart = null;

  }


  if (labels.length === 0) {

    return;

  }


  expenseChart =
    new Chart(
      ctx,
      {

        type: 'doughnut',

        data: {

          labels: labels,

          datasets: [{

            data: data,

            backgroundColor: [
              '#4361ee',
              '#3a0ca3',
              '#7209b7',
              '#f72585',
              '#4cc9f0',
              '#06d6a0',
              '#ffb703'
            ],

            borderWidth: 1

          }]

        },


        options: {

          responsive: true,

          maintainAspectRatio:
            false,

          plugins: {

            legend: {

              position: 'bottom',

              labels: {

                boxWidth: 12,

                font: {
                  size: 11
                }

              }

            }

          }

        }

      }
    );

}


// ======================================
// Search + Category Filter
// ======================================

function filterTransactions() {

  const searchText =
    searchInput.value
      .trim()
      .toLowerCase();


  const selectedCategory =
    categoryFilter.value;


  const filteredTransactions =
    allTransactions.filter(
      transaction => {

        const description =
          transaction.description
            .toLowerCase();


        const matchesSearch =
          description.includes(
            searchText
          );


        const matchesCategory =
          selectedCategory === 'All' ||
          transaction.category ===
            selectedCategory;


        return (
          matchesSearch &&
          matchesCategory
        );

      }
    );


  renderTransactions(
    filteredTransactions
  );

}


// ======================================
// Add Transaction
// ======================================

txForm.addEventListener(
  'submit',
  async (e) => {

    e.preventDefault();


    if (!token) {

      logout();

      return;

    }


    const description =
      descInput.value.trim();


    const amount =
      amountInput.value.trim();


    if (
      !description ||
      !amount
    ) {

      return;

    }


    submitBtn.disabled = true;

    submitBtn.textContent =
      'Categorizing...';


    try {

      const res =
        await fetch(
          `${API_URL}/add`,
          {
            method: 'POST',

            headers:
              authHeaders(),

            body:
              JSON.stringify({
                description,
                amount
              })

          }
        );


      if (res.status === 401) {

        logout();

        return;

      }


      const data =
        await res.json();


      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to add transaction'
        );

      }


      descInput.value = '';

      amountInput.value = '';


      await fetchTransactions();


    } catch (err) {

      console.error(
        'Error adding transaction:',
        err
      );

    } finally {

      submitBtn.disabled = false;

      submitBtn.textContent =
        'Log with AI Auto-Tag';

    }

  }
);


// ======================================
// Delete Transaction
// ======================================

async function deleteTransaction(
  id
) {

  if (!token) {

    logout();

    return;

  }


  try {

    const res =
      await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',

          headers: {
            'Authorization':
              `Bearer ${token}`
          }

        }
      );


    if (res.status === 401) {

      logout();

      return;

    }


    if (!res.ok) {

      throw new Error(
        'Failed to delete transaction'
      );

    }


    await fetchTransactions();


  } catch (err) {

    console.error(
      'Error deleting transaction:',
      err
    );

  }

}


// ======================================
// Escape HTML
// ======================================

function escapeHtml(
  string
) {

  const div =
    document.createElement(
      'div'
    );


  div.textContent =
    string;


  return div.innerHTML;

}


// ======================================
// Search Events
// ======================================

searchInput.addEventListener(
  'input',
  filterTransactions
);


categoryFilter.addEventListener(
  'change',
  filterTransactions
);


insightBtn.addEventListener(
  'click',
  getAIInsight
);


// ======================================
// Start Application
// ======================================

if (token && currentUser) {

  showApp();

} else {

  showAuth();

}

