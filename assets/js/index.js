const transactionUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expanseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector(' #form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'));
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : [];

const removeTransaction = (ID) => {
  transactions = transactions
    .filter((transaction) => transaction.id !== ID);
  updateLocalStorage();
  init();
};

// Função que adiciona a LI na UL, utilizando o DOM
const addTransactionIntoDOM = (transaction) => {
  const operator = transaction.amount < 0 ? '-' : '+';
  const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement('li');

  li.classList.add(CSSClass);
  li.innerHTML = `
    ${transaction.name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
      x
    </button>`;
  transactionUl.append(li);
};

const getExpanses = (transactionsAmounts) => Math.abs(transactionsAmounts
  .filter((value) => value < 0)
  .reduce((accumulator, value) => accumulator + value, 0))
  .toFixed(2);

const getIncome = (transactionsAmounts) => Math.abs(transactionsAmounts
  .filter((value) => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0))
  .toFixed(2);

const getTotal = (transactionsAmounts) => Math.abs(transactionsAmounts
  .reduce((accumulator, transaction) => accumulator + transaction, 0))
  .toFixed(2);

// Função que irá alterar o valor total das despesas e receitas somadas
const updateBalanceValues = () => {
  // Transforma o array de objetos em um array contendo apenas o amount do array anterior
  const transactionsAmounts = transactions.map(({ amount }) => amount);
  // Reduzi um array de valores das transações em um valor único, somando o accumulator que inicia com zero mais o valor da transação seguinte
  const total = getTotal(transactionsAmounts);
  const income = getIncome(transactionsAmounts);
  const expanse = getExpanses(transactionsAmounts);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expanseDisplay.textContent = `R$ ${expanse}`;
};

// Função inicializadora
const init = () => {
  transactionUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};
init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push( {
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  });
};

const cleanInputs = () => {
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();

  const isSomeInputEmpty = inputTransactionName.value === '' || inputTransactionAmount.value === '';

  if (isSomeInputEmpty) {
    alert('Por favor preencha tanto o nome tanto o valor da transação');
    return;
  }

  addToTransactionsArray(transactionName, transactionAmount);
  init();
  updateLocalStorage();
  cleanInputs();
};

form.addEventListener('submit', handleFormSubmit);
