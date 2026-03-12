(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var destructionLevel = parseFloat(document.getElementById('destructionLevel').value) || 0;
    var populationK = parseFloat(document.getElementById('populationK').value) || 0;
    var timeline = document.getElementById('timeline').value;

    // Calculation logic
    var baseCost = 80; var adjusted = baseCost * (destructionLevel / 100); var housing = adjusted * 0.4; var infra = adjusted * 0.35; var annual = adjusted / parseInt(timeline); var perCapita = Math.round(adjusted * 1e9 / (populationK * 1e3)); var comp = adjusted > 60 ? 'Comparable to Marshall Plan for a single country' : adjusted > 30 ? 'Similar to Iraq reconstruction scale' : 'Comparable to Lebanon 2006 rebuilding';     document.getElementById('totalCost').textContent = '$' + adjusted.toFixed(0) + ' billion';
    document.getElementById('housingCost').textContent = '$' + housing.toFixed(0) + ' billion';
    document.getElementById('infraCost').textContent = '$' + infra.toFixed(0) + ' billion';
    document.getElementById('annualSpend').textContent = '$' + annual.toFixed(1) + ' billion/year';
    document.getElementById('perCapitaCost').textContent = '$' + perCapita.toLocaleString() + '/person';
    document.getElementById('historicalComp').textContent = comp;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['destructionLevel', 'populationK', 'timeline'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
  document.getElementById('destructionLevel').addEventListener('input', function() { document.getElementById('destructionLevelVal').textContent = this.value + '%'; });
})();
