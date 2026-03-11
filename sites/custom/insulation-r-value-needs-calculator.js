(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var zone = document.getElementById('zone').value;
    var area = document.getElementById('area').value;
    var existing = parseFloat(document.getElementById('existing').value) || 0;

    // Calculation logic
    var rValues = {'Attic Floor': {'Zone 1 (Hot - Miami)': 30, 'Zone 2 (Hot - Houston)': 38, 'Zone 3 (Mixed-Hot - Atlanta)': 38, 'Zone 4 (Mixed - DC)': 49, 'Zone 5 (Cold - Chicago)': 49, 'Zone 6 (Cold - Minneapolis)': 60, 'Zone 7 (Very Cold - Duluth)': 60}, 'Exterior Wall': {'Zone 1 (Hot - Miami)': 13, 'Zone 2 (Hot - Houston)': 13, 'Zone 3 (Mixed-Hot - Atlanta)': 20, 'Zone 4 (Mixed - DC)': 20, 'Zone 5 (Cold - Chicago)': 20, 'Zone 6 (Cold - Minneapolis)': 21, 'Zone 7 (Very Cold - Duluth)': 21}, 'Crawl Space': {'Zone 1 (Hot - Miami)': 13, 'Zone 2 (Hot - Houston)': 19, 'Zone 3 (Mixed-Hot - Atlanta)': 19, 'Zone 4 (Mixed - DC)': 25, 'Zone 5 (Cold - Chicago)': 25, 'Zone 6 (Cold - Minneapolis)': 30, 'Zone 7 (Very Cold - Duluth)': 30}, 'Basement Wall': {'Zone 1 (Hot - Miami)': 0, 'Zone 2 (Hot - Houston)': 0, 'Zone 3 (Mixed-Hot - Atlanta)': 5, 'Zone 4 (Mixed - DC)': 10, 'Zone 5 (Cold - Chicago)': 15, 'Zone 6 (Cold - Minneapolis)': 15, 'Zone 7 (Very Cold - Duluth)': 15}}; var recommended = rValues[area][zone] || 30; var additional = Math.max(recommended - existing, 0); var fiberglass = additional / 3.2; return {recommended: 'R-' + fmt(recommended,0), additional: 'R-' + fmt(additional,0), fiberglass: fmt(fiberglass,1)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['zone', 'area', 'existing'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
