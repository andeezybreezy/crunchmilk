(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var buy=f('purchasePrice');var sell=f('salePrice');var months=f('holdMonths');var inc=f('income');var gain=sell-buy;var longTerm=months>=12;var rate;if(longTerm){rate=inc<47150?0:inc<518900?0.15:0.20;}else{rate=inc<47150?0.12:inc<100525?0.22:inc<191950?0.24:0.32;}var tax=Math.max(0,gain*rate);var _r = {gain:$(gain),taxRate:pct(rate*100,0),taxOwed:$(tax),netProfit:$(gain-tax)};

    document.getElementById('gain').textContent = _r.gain;
    document.getElementById('taxRate').textContent = _r.taxRate;
    document.getElementById('taxOwed').textContent = _r.taxOwed;
    document.getElementById('netProfit').textContent = _r.netProfit;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['purchasePrice', 'salePrice', 'holdMonths', 'income'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
