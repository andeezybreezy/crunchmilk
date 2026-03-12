(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var balance = parseFloat(document.getElementById('balance').value) || 0;
    var currentRate = parseFloat(document.getElementById('currentRate').value) || 0;
    var currentMonths = parseFloat(document.getElementById('currentMonths').value) || 0;
    var newRate = parseFloat(document.getElementById('newRate').value) || 0;
    var newMonths = parseFloat(document.getElementById('newMonths').value) || 0;

    // Calculation logic
    var cr = currentRate/100/12; var nr = newRate/100/12; var currentPayment = balance * cr / (1 - Math.pow(1+cr, -currentMonths)); var newPayment = balance * nr / (1 - Math.pow(1+nr, -newMonths)); var currentTotal = currentPayment * currentMonths; var newTotal = newPayment * newMonths; var totalSavings = currentTotal - newTotal; var monthlySavings = currentPayment - newPayment;     document.getElementById('currentPayment').textContent = dollar(currentPayment);
    document.getElementById('newPayment').textContent = dollar(newPayment);
    document.getElementById('monthlySavings').textContent = dollar(monthlySavings);
    document.getElementById('totalSavings').textContent = dollar(totalSavings);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['balance', 'currentRate', 'currentMonths', 'newRate', 'newMonths'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
