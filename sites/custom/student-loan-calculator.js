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
    var term = parseFloat(document.getElementById('term').value) || 0;

    // Calculation logic
    var r = rate / 100 / 12; var n = term * 12; var pmt = r > 0 ? balance * (r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1) : balance/n; var total = pmt * n; document.getElementById('monthly').textContent = dollar(pmt); document.getElementById('totalPaid').textContent = dollar(total); document.getElementById('totalInterest').textContent = dollar(total - balance); document.getElementById('intPct').textContent = pct((total - balance) / balance * 100);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['balance', 'rate', 'term'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
