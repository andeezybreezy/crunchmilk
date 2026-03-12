(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var usageType = document.getElementById('usageType').value;
    var productionTier = document.getElementById('productionTier').value;
    var duration = parseFloat(document.getElementById('duration').value) || 0;
    var territory = document.getElementById('territory').value;
    var exclusivity = document.getElementById('exclusivity').value;
    var tracks = parseFloat(document.getElementById('tracks').value) || 0;

    // Calculation logic
    var baseFees = {
      tv:    {indie: 500,  mid: 2500,  major: 10000},
      film:  {indie: 1000, mid: 5000,  major: 25000},
      commercial: {indie: 1500, mid: 7500, major: 30000},
      social: {indie: 100, mid: 500,   major: 2000},
      podcast: {indie: 50, mid: 250,   major: 1000},
      game:  {indie: 750,  mid: 3000,  major: 15000}
    };
    var base = baseFees[usageType][productionTier];
    var durationMult = duration > 60 ? 1.5 : (duration > 15 ? 1.0 : 0.75);
    base = base * durationMult;
    var territoryMult = {local: 0.5, national: 1.0, worldwide: 2.0};
    var terrAdj = base * territoryMult[territory] - base;
    var withTerritory = base + terrAdj;
    var exclAdj = exclusivity === 'exclusive' ? withTerritory : 0;
    var perTrack = withTerritory + exclAdj;
    var total = perTrack * tracks;
    document.getElementById('baseFee').textContent = '$' + base.toFixed(0);
    document.getElementById('territoryAdj').textContent = (terrAdj >= 0 ? '+$' : '-$') + Math.abs(terrAdj).toFixed(0);
    document.getElementById('exclusivityAdj').textContent = exclAdj > 0 ? '+$' + exclAdj.toFixed(0) : '$0';
    document.getElementById('perTrackTotal').textContent = '$' + perTrack.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('grandTotal').textContent = '$' + total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['usageType', 'productionTier', 'duration', 'territory', 'exclusivity', 'tracks'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
