(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var refugees = parseFloat(document.getElementById('refugees').value) || 0;
    var hostCountryIncome = document.getElementById('hostCountryIncome').value;
    var duration = parseFloat(document.getElementById('duration').value) || 0;

    // Calculation logic
    var perPerson = {low: 3500, middle: 8000, high: 25000}; var pp = perPerson[hostCountryIncome]; var annual = refugees * pp; var total = annual * duration; var shelter = Math.round(pp * 0.35); var food = Math.round(pp * 0.25); var health = Math.round(pp * 0.15); var education = Math.round(pp * 0.10); var comp = 'Shelter: $' + shelter + ', Food: $' + food + ', Health: $' + health + ', Education: $' + education + '/person/yr'; var context = annual > 10e9 ? 'Major GDP burden for most host countries' : annual > 1e9 ? 'Significant fiscal impact, needs international support' : 'Manageable with international aid coordination';     document.getElementById('annualCost').textContent = '$' + (annual / 1e9).toFixed(1) + ' billion/year';
    document.getElementById('totalCost').textContent = '$' + (total / 1e9).toFixed(1) + ' billion';
    document.getElementById('perRefugeeCost').textContent = '$' + pp.toLocaleString() + '/person/year';
    document.getElementById('components').textContent = comp;
    document.getElementById('gdpImpact').textContent = context;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['refugees', 'hostCountryIncome', 'duration'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
