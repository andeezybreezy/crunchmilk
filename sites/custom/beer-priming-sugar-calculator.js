(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var batchGal = parseFloat(document.getElementById('batchGal').value) || 0;
    var beerTemp = parseFloat(document.getElementById('beerTemp').value) || 0;
    var targetVols = parseFloat(document.getElementById('targetVols').value) || 0;
    var sugarType = document.getElementById('sugarType').value;

    // Calculation logic
    var residualCO2=3.0378-(0.050062*beerTemp)+(0.00026555*beerTemp*beerTemp); var neededCO2=targetVols-residualCO2; var cornSugarG=neededCO2*batchGal*3.785*4; var multipliers={corn:1,table:0.91,dme:1.47,honey:1.25}; var sugarG=cornSugarG*multipliers[sugarType]; var sugarOz=sugarG/28.35; var sugarCups=sugarOz/7; return {sugarOz:fmt(sugarOz,1)+' oz', sugarG:fmt(sugarG,0)+' g', sugarCups:fmt(sugarCups,2)+' cups'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['batchGal', 'beerTemp', 'targetVols', 'sugarType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
