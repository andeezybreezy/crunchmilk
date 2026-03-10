(function() {
  'use strict';

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  var needsBreakdown = [
    ['Rent / Mortgage', 0.55],
    ['Utilities', 0.10],
    ['Groceries', 0.15],
    ['Transportation', 0.10],
    ['Insurance (health/auto)', 0.07],
    ['Minimum Debt Payments', 0.03]
  ];

  var wantsBreakdown = [
    ['Dining Out', 0.25],
    ['Entertainment & Streaming', 0.20],
    ['Shopping & Clothing', 0.15],
    ['Hobbies & Fitness', 0.15],
    ['Travel & Vacations', 0.15],
    ['Personal Care', 0.10]
  ];

  var savingsBreakdown = [
    ['Emergency Fund', 0.25],
    ['Retirement (401k/IRA)', 0.35],
    ['Investments', 0.15],
    ['Extra Debt Payments', 0.15],
    ['Short-Term Goals', 0.10]
  ];

  function renderBreakdown(tbody, items, totalAmount) {
    tbody.innerHTML = '';
    items.forEach(function(item) {
      var amount = totalAmount * item[1];
      var tr = document.createElement('tr');
      tr.innerHTML = '<td style="padding:6px;border-bottom:1px solid #eee">' + item[0] + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right;color:#666">' + Math.round(item[1] * 100) + '%</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right;font-weight:500">' + fmt(amount) + '</td>';
      tbody.appendChild(tr);
    });
  }

  function calculate() {
    var income = parseFloat(document.getElementById('monthlyIncome').value) || 0;
    if (income <= 0) return;

    var needsPct = parseFloat(document.getElementById('needsPct').value) || 50;
    var wantsPct = parseFloat(document.getElementById('wantsPct').value) || 30;
    var savingsPct = parseFloat(document.getElementById('savingsPct').value) || 20;

    var total = needsPct + wantsPct + savingsPct;
    var warning = document.getElementById('pctWarning');
    if (Math.abs(total - 100) > 0.01) {
      warning.style.display = '';
      warning.textContent = 'Percentages add up to ' + total.toFixed(1) + '% (should be 100%)';
    } else {
      warning.style.display = 'none';
    }

    var needs = income * (needsPct / 100);
    var wants = income * (wantsPct / 100);
    var savings = income * (savingsPct / 100);

    document.getElementById('needsAmount').textContent = fmt(needs);
    document.getElementById('wantsAmount').textContent = fmt(wants);
    document.getElementById('savingsAmount').textContent = fmt(savings);
    document.getElementById('needsPctDisplay').textContent = needsPct + '%';
    document.getElementById('wantsPctDisplay').textContent = wantsPct + '%';
    document.getElementById('savingsPctDisplay').textContent = savingsPct + '%';

    renderBreakdown(document.getElementById('needsBody'), needsBreakdown, needs);
    renderBreakdown(document.getElementById('wantsBody'), wantsBreakdown, wants);
    renderBreakdown(document.getElementById('savingsBody'), savingsBreakdown, savings);
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
