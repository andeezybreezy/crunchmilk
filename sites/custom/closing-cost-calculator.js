(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
    var downPct = parseFloat(document.getElementById('downPct').value) || 0;
    var state = document.getElementById('state').value;

    // Calculation logic
    var pcts = {low: 0.025, avg: 0.035, high: 0.05}; var closePct = pcts[state] || 0.035; var loanAmt = homePrice * (1 - downPct/100); var closing = loanAmt * closePct; var downPayment = homePrice * (downPct / 100); document.getElementById('totalClosing').textContent = dollar(closing); document.getElementById('cashNeeded').textContent = dollar(closing + downPayment); document.getElementById('breakdown').textContent = 'Loan origination: ' + dollar(loanAmt * 0.01) + ' | Title: ' + dollar(1500) + ' | Escrow: ' + dollar(homePrice * 0.005);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['homePrice', 'downPct', 'state'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
