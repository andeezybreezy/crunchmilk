(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalOz = parseFloat(document.getElementById('totalOz').value) || 0;
    var color1Pct = parseFloat(document.getElementById('color1Pct').value) || 0;
    var color2Pct = parseFloat(document.getElementById('color2Pct').value) || 0;
    var color3Pct = parseFloat(document.getElementById('color3Pct').value) || 0;

    // Calculation logic
    var total = color1Pct + color2Pct + color3Pct; var a1 = totalOz * (color1Pct / total); var a2 = totalOz * (color2Pct / total); var a3 = totalOz * (color3Pct / total); document.getElementById('amt1').textContent = fmt(a1, 1) + ' oz'; document.getElementById('amt2').textContent = fmt(a2, 1) + ' oz'; document.getElementById('amt3').textContent = fmt(a3, 1) + ' oz'; document.getElementById('validation').textContent = total === 100 ? 'Ratios total 100% ✓' : 'Ratios total ' + total + '% — normalized to 100%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalOz', 'color1Pct', 'color2Pct', 'color3Pct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
