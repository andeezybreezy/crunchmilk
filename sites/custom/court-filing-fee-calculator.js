(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var caseType = document.getElementById('caseType').value;
    var amount = parseFloat(document.getElementById('amount').value) || 0;

    // Calculation logic
    var fees = {small: 75, civil: 350, divorce: 300, bankruptcy: 338, federal: 405}; var filing = fees[caseType] || 350; if (caseType === 'small' && amount > 10000) filing = 100; if (caseType === 'civil' && amount > 100000) filing = 500; var service = caseType === 'small' ? 40 : 85; document.getElementById('filingFee').textContent = dollar(filing); document.getElementById('serviceFee').textContent = dollar(service); document.getElementById('totalInitial').textContent = dollar(filing + service);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['caseType', 'amount'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
