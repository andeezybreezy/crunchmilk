(function() {
  'use strict';

  var calcMode = document.getElementById('calcMode');
  var costGroup = document.getElementById('costGroup');
  var markupGroup = document.getElementById('markupGroup');
  var priceGroup = document.getElementById('priceGroup');
  var costInput = document.getElementById('cost');
  var markupInput = document.getElementById('markupPct');
  var priceInput = document.getElementById('price');
  var calcBtn = document.getElementById('calcBtn');
  var resultDiv = document.getElementById('result');

  var resultPrice = document.getElementById('resultPrice');
  var resultMarkup = document.getElementById('resultMarkup');
  var resultMargin = document.getElementById('resultMargin');
  var resultCost = document.getElementById('resultCost');
  var resultProfit = document.getElementById('resultProfit');

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function updateMode() {
    var mode = calcMode.value;
    costGroup.style.display = (mode === 'priceMarkup') ? 'none' : 'block';
    markupGroup.style.display = (mode === 'costPrice') ? 'none' : 'block';
    priceGroup.style.display = (mode === 'costMarkup') ? 'none' : 'block';
  }

  calcMode.addEventListener('change', updateMode);

  function calculate() {
    var mode = calcMode.value;
    var cost, markup, price, profit, margin;

    if (mode === 'costMarkup') {
      cost = parseFloat(costInput.value) || 0;
      markup = parseFloat(markupInput.value) || 0;
      if (cost <= 0) return;
      price = cost * (1 + markup / 100);
      profit = price - cost;
      margin = price > 0 ? (profit / price) * 100 : 0;
    } else if (mode === 'costPrice') {
      cost = parseFloat(costInput.value) || 0;
      price = parseFloat(priceInput.value) || 0;
      if (cost <= 0 || price <= 0) return;
      profit = price - cost;
      markup = (profit / cost) * 100;
      margin = (profit / price) * 100;
    } else {
      price = parseFloat(priceInput.value) || 0;
      markup = parseFloat(markupInput.value) || 0;
      if (price <= 0) return;
      cost = price / (1 + markup / 100);
      profit = price - cost;
      margin = (profit / price) * 100;
    }

    resultPrice.textContent = fmt(price);
    resultCost.textContent = fmt(cost);
    resultMarkup.textContent = markup.toFixed(2) + '%';
    resultMargin.textContent = margin.toFixed(2) + '%';
    resultProfit.textContent = fmt(profit);

    resultDiv.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);

  [costInput, markupInput, priceInput].forEach(function(el) {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

  updateMode();
  calculate();
})();
