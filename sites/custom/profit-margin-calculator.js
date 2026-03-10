(function() {
  'use strict';

  var calcMode = document.getElementById('calcMode');
  var revenueGroup = document.getElementById('revenueGroup');
  var costGroup = document.getElementById('costGroup');
  var marginGroup = document.getElementById('marginGroup');
  var revenueInput = document.getElementById('revenue');
  var costInput = document.getElementById('cost');
  var marginInput = document.getElementById('marginInput');
  var opExpenses = document.getElementById('opExpenses');
  var calcBtn = document.getElementById('calcBtn');
  var resultDiv = document.getElementById('result');

  var grossProfitEl = document.getElementById('grossProfit');
  var grossMarginEl = document.getElementById('grossMargin');
  var markupPctEl = document.getElementById('markupPct');
  var resultRevenueEl = document.getElementById('resultRevenue');
  var resultCostEl = document.getElementById('resultCost');
  var netMarginEl = document.getElementById('netMargin');

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function updateMode() {
    var mode = calcMode.value;
    revenueGroup.style.display = (mode === 'costMargin') ? 'none' : 'block';
    costGroup.style.display = (mode === 'revMargin') ? 'none' : 'block';
    marginGroup.style.display = (mode === 'revCost') ? 'none' : 'block';
  }

  calcMode.addEventListener('change', updateMode);

  function calculate() {
    var mode = calcMode.value;
    var revenue, cost, margin, grossProfit, markup, opExp;

    opExp = parseFloat(opExpenses.value) || 0;

    if (mode === 'revCost') {
      revenue = parseFloat(revenueInput.value) || 0;
      cost = parseFloat(costInput.value) || 0;
      if (revenue <= 0) return;
      grossProfit = revenue - cost;
      margin = (grossProfit / revenue) * 100;
      markup = cost > 0 ? (grossProfit / cost) * 100 : 0;
    } else if (mode === 'revMargin') {
      revenue = parseFloat(revenueInput.value) || 0;
      margin = parseFloat(marginInput.value) || 0;
      if (revenue <= 0) return;
      grossProfit = revenue * (margin / 100);
      cost = revenue - grossProfit;
      markup = cost > 0 ? (grossProfit / cost) * 100 : 0;
    } else {
      cost = parseFloat(costInput.value) || 0;
      margin = parseFloat(marginInput.value) || 0;
      if (margin >= 100) return;
      revenue = cost / (1 - margin / 100);
      grossProfit = revenue - cost;
      markup = cost > 0 ? (grossProfit / cost) * 100 : 0;
    }

    var netProfit = grossProfit - opExp;
    var netMarg = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    grossProfitEl.textContent = fmt(grossProfit);
    grossMarginEl.textContent = margin.toFixed(2) + '%';
    markupPctEl.textContent = markup.toFixed(2) + '%';
    resultRevenueEl.textContent = fmt(revenue);
    resultCostEl.textContent = fmt(cost);
    netMarginEl.textContent = opExp > 0 ? netMarg.toFixed(2) + '%' : 'Enter expenses above';

    resultDiv.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);

  [revenueInput, costInput, marginInput, opExpenses].forEach(function(el) {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

  updateMode();
  calculate();
})();
