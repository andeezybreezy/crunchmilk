(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var carsPerDay = parseFloat(document.getElementById('carsPerDay').value) || 0;
    var avgTicket = parseFloat(document.getElementById('avgTicket').value) || 0;
    var operatingDays = parseFloat(document.getElementById('operatingDays').value) || 0;
    var expensePct = parseFloat(document.getElementById('expensePct').value) || 0;

    // Calculation logic
    var monthlyRevenue = carsPerDay * avgTicket * operatingDays; var monthlyProfit = monthlyRevenue * (1 - expensePct/100); var annualProfit = monthlyProfit * 12;     document.getElementById('monthlyRevenue').textContent = dollar(monthlyRevenue);
    document.getElementById('monthlyProfit').textContent = dollar(monthlyProfit);
    document.getElementById('annualProfit').textContent = dollar(annualProfit);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['carsPerDay', 'avgTicket', 'operatingDays', 'expensePct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
