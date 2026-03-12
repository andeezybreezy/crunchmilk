(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var numItems = parseFloat(document.getElementById('numItems').value) || 0;
    var itemWeight = parseFloat(document.getElementById('itemWeight').value) || 0;
    var numColors = parseFloat(document.getElementById('numColors').value) || 0;
    var dyeStrength = document.getElementById('dyeStrength').value;

    // Calculation logic
    var totalOz = numItems * itemWeight;
    var totalLbs = totalOz / 16;
    var dyeRates = {light: 0.5, medium: 1.5, dark: 3, black: 6};
    var tspPerLb = dyeRates[dyeStrength];
    var totalDyeTsp = totalLbs * tspPerLb;
    var perColor = totalDyeTsp / numColors;
    var sodaAshTsp = totalLbs * 4;
    var waterCups = totalLbs * 8;
    var sodaWaterGal = totalLbs * 0.5;
    document.getElementById('totalFabric').textContent = fmt(totalOz, 0) + ' oz (' + fmt(totalLbs, 1) + ' lbs)';
    document.getElementById('dyePerColor').textContent = fmt(perColor, 1) + ' tsp per color (' + fmt(perColor * 3, 1) + ' tsp = ' + fmt(perColor / 3, 1) + ' tbsp total dye)';
    document.getElementById('sodaAsh').textContent = fmt(sodaAshTsp, 0) + ' tsp (1 cup per gallon of soak water)';
    document.getElementById('waterTotal').textContent = fmt(waterCups, 0) + ' cups for dye solution + ' + fmt(sodaWaterGal, 1) + ' gallon(s) soak water';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['numItems', 'itemWeight', 'numColors', 'dyeStrength'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
