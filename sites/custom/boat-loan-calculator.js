(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var boatPrice = parseFloat(document.getElementById('boatPrice').value) || 0;
    var downPay = parseFloat(document.getElementById('downPay').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;
    var term = parseFloat(document.getElementById('term').value) || 0;

    // Calculation logic
    var loan = boatPrice - downPay; var r = rate / 100 / 12; var n = term * 12; var pmt = r > 0 ? loan * (r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1) : loan/n; document.getElementById('monthlyPay').textContent = dollar(pmt); document.getElementById('totalInt').textContent = dollar(pmt*n - loan); document.getElementById('totalCost').textContent = dollar(pmt*n + downPay);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['boatPrice', 'downPay', 'rate', 'term'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
