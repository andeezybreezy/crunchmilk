(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var waterCups = parseFloat(document.getElementById('waterCups').value) || 0;
    var brinePct = document.getElementById('brinePct').value;

    // Calculation logic
    var waterMl = waterCups * 236.6; var pcts = {'3.5% (light - vegetables)': 3.5, '5% (standard - poultry)': 5, '10% (heavy - pickles)': 10, '20% (curing)': 20}; var pct = pcts[brinePct] || 5; var saltGrams = waterMl * (pct/100); var saltTbsp = saltGrams / 15; var times = {'3.5% (light - vegetables)': 2, '5% (standard - poultry)': 8, '10% (heavy - pickles)': 24, '20% (curing)': 48}; var soakTime = times[brinePct] || 8;     document.getElementById('saltTbsp').textContent = fmt(saltTbsp,1);
    document.getElementById('saltGrams').textContent = fmt(saltGrams,0);
    document.getElementById('soakTime').textContent = fmt(soakTime,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['waterCups', 'brinePct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
