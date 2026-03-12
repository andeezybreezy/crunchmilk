(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sqft = parseFloat(document.getElementById('sqft').value) || 0;
    var homeAge = parseFloat(document.getElementById('homeAge').value) || 0;
    var furnaceService = document.getElementById('furnaceService').value;
    var gutterClean = document.getElementById('gutterClean').value;
    var diyLevel = document.getElementById('diyLevel').value;

    // Calculation logic
    var diyMult = {none: 1.5, some: 1.0, handy: 0.6}; var dm = diyMult[diyLevel] || 1.0; var hvac = 0; if (furnaceService === 'tuneup') hvac = 150; else if (furnaceService === 'repair') hvac = 550; var gutters = gutterClean === 'yes' ? 225 * (sqft / 2000) : 0; var sealing = (40 + homeAge * 2) * dm; var yard = (100 + sqft * 0.02) * dm; var total = hvac + gutters + sealing + yard; var skipPenalty = total * 3.5; document.getElementById('hvacCost').textContent = dollar(hvac); document.getElementById('gutterCost').textContent = dollar(gutters); document.getElementById('sealingCost').textContent = dollar(sealing); document.getElementById('yardCost').textContent = dollar(yard); document.getElementById('totalCost').textContent = dollar(total); document.getElementById('skipCost').textContent = dollar(skipPenalty) + ' in potential repair bills';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sqft', 'homeAge', 'furnaceService', 'gutterClean', 'diyLevel'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
