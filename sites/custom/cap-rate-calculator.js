(function() {
  'use strict';

  var modeForward = document.getElementById('modeForward');
  var modeReverse = document.getElementById('modeReverse');
  var forwardMode = document.getElementById('forwardMode');
  var reverseMode = document.getElementById('reverseMode');
  var calcBtn = document.getElementById('calcBtn');
  var resultDiv = document.getElementById('result');

  var propertyPrice = document.getElementById('propertyPrice');
  var grossIncome = document.getElementById('grossIncome');
  var expenseModeSelect = document.getElementById('expenseMode');
  var expensesInput = document.getElementById('expenses');
  var expenseLabel = document.getElementById('expenseLabel');
  var revNOI = document.getElementById('revNOI');
  var revCapRate = document.getElementById('revCapRate');

  var resultLabel1 = document.getElementById('resultLabel1');
  var resultLabel2 = document.getElementById('resultLabel2');
  var resultLabel3 = document.getElementById('resultLabel3');
  var resultVal1 = document.getElementById('resultVal1');
  var resultVal2 = document.getElementById('resultVal2');
  var resultVal3 = document.getElementById('resultVal3');
  var extraResults = document.getElementById('extraResults');
  var grmEl = document.getElementById('grm');
  var expenseRatioEl = document.getElementById('expenseRatio');

  var isForward = true;

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function fmtRound(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function setMode(forward) {
    isForward = forward;
    forwardMode.style.display = forward ? 'block' : 'none';
    reverseMode.style.display = forward ? 'none' : 'block';

    if (forward) {
      modeForward.classList.add('convert-btn');
      modeForward.style.border = 'none';
      modeForward.style.background = '';
      modeReverse.classList.remove('convert-btn');
      modeReverse.style.border = '2px solid var(--border)';
      modeReverse.style.background = 'white';
    } else {
      modeReverse.classList.add('convert-btn');
      modeReverse.style.border = 'none';
      modeReverse.style.background = '';
      modeForward.classList.remove('convert-btn');
      modeForward.style.border = '2px solid var(--border)';
      modeForward.style.background = 'white';
    }
  }

  modeForward.addEventListener('click', function() { setMode(true); });
  modeReverse.addEventListener('click', function() { setMode(false); });

  expenseModeSelect.addEventListener('change', function() {
    if (expenseModeSelect.value === 'percent') {
      expenseLabel.textContent = '% of income';
      expensesInput.value = '35';
      expensesInput.max = '100';
    } else {
      expenseLabel.textContent = '/ year';
      expensesInput.value = '12000';
      expensesInput.max = '';
    }
  });

  function calculate() {
    if (isForward) {
      var price = parseFloat(propertyPrice.value) || 0;
      var gross = parseFloat(grossIncome.value) || 0;
      var expVal = parseFloat(expensesInput.value) || 0;
      if (price <= 0 || gross <= 0) return;

      var expenses;
      if (expenseModeSelect.value === 'percent') {
        expenses = gross * (expVal / 100);
      } else {
        expenses = expVal;
      }

      var noi = gross - expenses;
      var capRate = (noi / price) * 100;
      var grm = gross > 0 ? price / gross : 0;
      var expRatio = gross > 0 ? (expenses / gross) * 100 : 0;

      resultLabel1.textContent = 'Cap Rate';
      resultLabel2.textContent = 'Annual NOI';
      resultLabel3.textContent = 'Monthly NOI';
      resultVal1.textContent = capRate.toFixed(2) + '%';
      resultVal1.style.color = capRate >= 6 ? '#059669' : capRate >= 4 ? '#d97706' : '#dc2626';
      resultVal2.textContent = fmtRound(noi);
      resultVal3.textContent = fmtRound(noi / 12);

      grmEl.textContent = grm.toFixed(2) + 'x';
      expenseRatioEl.textContent = expRatio.toFixed(1) + '%';
      extraResults.style.display = '';
    } else {
      var noi2 = parseFloat(revNOI.value) || 0;
      var targetRate = parseFloat(revCapRate.value) || 0;
      if (noi2 <= 0 || targetRate <= 0) return;

      var maxPrice = noi2 / (targetRate / 100);

      resultLabel1.textContent = 'Max Purchase Price';
      resultLabel2.textContent = 'Annual NOI';
      resultLabel3.textContent = 'Monthly NOI';
      resultVal1.textContent = fmtRound(maxPrice);
      resultVal1.style.color = 'var(--primary)';
      resultVal2.textContent = fmtRound(noi2);
      resultVal3.textContent = fmtRound(noi2 / 12);

      extraResults.style.display = 'none';
    }

    resultDiv.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  calculate();
})();
