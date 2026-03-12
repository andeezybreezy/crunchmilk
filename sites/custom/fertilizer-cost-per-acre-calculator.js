(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var acres = parseFloat(document.getElementById('acres').value) || 0;
    var nRate = parseFloat(document.getElementById('nRate').value) || 0;
    var nCost = parseFloat(document.getElementById('nCost').value) || 0;
    var pRate = parseFloat(document.getElementById('pRate').value) || 0;
    var pCost = parseFloat(document.getElementById('pCost').value) || 0;
    var kRate = parseFloat(document.getElementById('kRate').value) || 0;
    var kCost = parseFloat(document.getElementById('kCost').value) || 0;

    // Calculation logic
    var nc = nRate * nCost; var pc = pRate * pCost; var kc = kRate * kCost; var pa = nc + pc + kc; var gt = pa * acres; document.getElementById('nTotal').textContent = dollar(nc); document.getElementById('pTotal').textContent = dollar(pc); document.getElementById('kTotal').textContent = dollar(kc); document.getElementById('perAcre').textContent = dollar(pa); document.getElementById('grandTotal').textContent = dollar(gt);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['acres', 'nRate', 'nCost', 'pRate', 'pCost', 'kRate', 'kCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
