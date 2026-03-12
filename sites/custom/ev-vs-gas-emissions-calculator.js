(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var annualMiles = parseFloat(document.getElementById('annualMiles').value) || 0;
    var gasMpg = parseFloat(document.getElementById('gasMpg').value) || 0;
    var evEfficiency = parseFloat(document.getElementById('evEfficiency').value) || 0;
    var gridCarbon = parseFloat(document.getElementById('gridCarbon').value) || 0;

    // Calculation logic
    var gasTons = (annualMiles / gasMpg) * 8.887 / 2000; var evKwh = annualMiles * evEfficiency; var evTons = (evKwh * gridCarbon) / 1000000; var savings = gasTons - evTons;     document.getElementById('gasTons').textContent = fmt(gasTons,1);
    document.getElementById('evTons').textContent = fmt(evTons,1);
    document.getElementById('savings').textContent = fmt(savings,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annualMiles', 'gasMpg', 'evEfficiency', 'gridCarbon'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
