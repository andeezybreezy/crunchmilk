(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var rvValue = parseFloat(document.getElementById('rvValue').value) || 0;
    var rvType = document.getElementById('rvType').value;
    var fullTime = document.getElementById('fullTime').value;

    // Calculation logic
    var baseRates = {classA: 0.015, classC: 0.012, travel: 0.008, fifth: 0.009}; var baseRate = baseRates[rvType] || 0.012; if (fullTime === 'full') baseRate *= 1.4; var annual = Math.max(rvValue * baseRate, 500); document.getElementById('annual').textContent = dollar(annual); document.getElementById('monthly').textContent = dollar(annual / 12); document.getElementById('perTrip').textContent = dollar(annual / 4); document.getElementById('resultTip').textContent = fullTime === 'full' ? 'Full-time rates are typically 30-50% higher than part-time.' : 'Bundle with auto insurance for 5-15% savings.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['rvValue', 'rvType', 'fullTime'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
