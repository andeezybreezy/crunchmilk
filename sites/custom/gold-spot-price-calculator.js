(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var unit = document.getElementById('unit').value;
    var spotPrice = parseFloat(document.getElementById('spotPrice').value) || 0;

    // Calculation logic
    var convToOz={oz:1,g:0.03215,kg:32.1507,dwt:0.05}; var oz=weight*(convToOz[unit]||1); var value=oz*spotPrice; var grams=oz*31.1035;     document.getElementById('value').textContent = dollar(value);
    document.getElementById('weightOz').textContent = fmt(oz, 2)+' troy oz';
    document.getElementById('weightG').textContent = fmt(grams,2)+' g';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'unit', 'spotPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
