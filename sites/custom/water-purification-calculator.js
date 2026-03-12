(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var numPeople = parseFloat(document.getElementById('numPeople').value) || 0;
    var numDays = parseFloat(document.getElementById('numDays').value) || 0;
    var gallonsPerDay = parseFloat(document.getElementById('gallonsPerDay').value) || 0;
    var method = document.getElementById('method').value;

    // Calculation logic
    var totalGal = numPeople * numDays * gallonsPerDay;
    var totalLiters = totalGal * 3.785;
    var details, supply, time;
    if (method === 'boil') {
      details = 'Rolling boil for 1 minute (3 min above 6,500 ft)';
      var fuelLbs = totalLiters * 0.1;
      supply = fmt(fuelLbs, 1) + ' lbs firewood or ' + fmt(totalLiters * 0.02, 1) + ' lbs propane';
      time = fmt(totalLiters * 12, 0) + ' minutes total boiling time';
    } else if (method === 'tablets') {
      var tablets = Math.ceil(totalLiters);
      details = '1 tablet per liter, wait 30 minutes';
      supply = tablets + ' purification tablets';
      time = '30 min wait per batch';
    } else if (method === 'filter') {
      details = 'Pump through 0.2 micron filter';
      supply = '1 filter (good for ~1,000L). Yours treats ' + fmt(totalLiters, 0) + 'L';
      time = fmt(totalLiters * 1.5, 0) + ' minutes pumping';
    } else if (method === 'uv') {
      details = 'UV light for 60 seconds per liter (clear water only)';
      supply = fmt(Math.ceil(totalLiters / 80), 0) + ' sets of batteries';
      time = fmt(totalLiters, 0) + ' minutes treatment time';
    } else {
      var drops = totalLiters * 2;
      details = '2 drops unscented bleach (8.25%) per liter, wait 30 min';
      supply = fmt(drops / 20, 1) + ' mL bleach (' + fmt(drops / 20 / 5, 2) + ' teaspoons)';
      time = '30 min wait per batch';
    }
    document.getElementById('totalWater').textContent = fmt(totalGal, 1) + ' gallons (' + fmt(totalLiters, 1) + ' liters)';
    document.getElementById('purifyDetails').textContent = details;
    document.getElementById('fuelOrSupply').textContent = supply;
    document.getElementById('timeRequired').textContent = time;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['numPeople', 'numDays', 'gallonsPerDay', 'method'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
