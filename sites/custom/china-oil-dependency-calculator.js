(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var disruptionPct = parseFloat(document.getElementById('disruptionPct').value) || 0;
    var sprDays = parseFloat(document.getElementById('sprDays').value) || 0;
    var oilPrice = parseFloat(document.getElementById('oilPrice').value) || 0;

    // Calculation logic
    var totalConsumption = 15.4; var domesticProd = 4.1; var imports = totalConsumption - domesticProd; var depPct = (imports / totalConsumption * 100); var disrupted = imports * (disruptionPct / 100); var sprBarrels = sprDays * disrupted; var actualSprDays = Math.round(sprBarrels / disrupted); var gdpImpact = (disruptionPct / 100) * 3.5;     document.getElementById('importDependency').textContent = depPct.toFixed(0) + '% of oil imported';
    document.getElementById('dailyImports').textContent = imports.toFixed(1) + ' million bpd';
    document.getElementById('supplyLoss').textContent = disrupted.toFixed(1) + ' million bpd cut';
    document.getElementById('sprCoverage').textContent = actualSprDays + ' days at disrupted rate';
    document.getElementById('economicImpact').textContent = gdpImpact.toFixed(1) + '% GDP reduction (est.)';
    document.getElementById('mainRoutes').textContent = 'Strait of Malacca (80%), Middle East (47% of imports)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['disruptionPct', 'sprDays', 'oilPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
