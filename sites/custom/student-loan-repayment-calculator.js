(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var balance = parseFloat(document.getElementById('balance').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;
    var payment = parseFloat(document.getElementById('payment').value) || 0;

    // Calculation logic
    var monthlyRate = rate / 100 / 12; var months = Math.ceil(-Math.log(1 - (balance * monthlyRate / payment)) / Math.log(1 + monthlyRate)); var totalPaid = months * payment; var totalInterest = totalPaid - balance;     document.getElementById('months').textContent = fmt(months,0);
    document.getElementById('totalInterest').textContent = dollar(totalInterest);
    document.getElementById('totalPaid').textContent = dollar(totalPaid);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['balance', 'rate', 'payment'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
