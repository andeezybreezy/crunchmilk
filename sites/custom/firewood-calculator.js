(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var purpose = document.getElementById('purpose').value;
    var hours = parseFloat(document.getElementById('hours').value) || 0;
    var numDays = parseFloat(document.getElementById('numDays').value) || 0;
    var woodType = document.getElementById('woodType').value;

    // Calculation logic
    var btuPerCord = parseFloat(woodType) * 1e6;
    var btuPerHour = {heating: 40000, campfire: 15000, cooking: 10000, survival: 25000};
    var totalBTU = btuPerHour[purpose] * hours * numDays;
    var efficiency = purpose === 'heating' ? 0.7 : 0.3;
    var effectiveBTU = totalBTU / efficiency;
    var cords = effectiveBTU / btuPerCord;
    var cubFt = cords * 128;
    var weight = cords * 3500;
    var costPerCord = 250;
    var cost = cords * costPerCord;
    document.getElementById('cordsNeeded').textContent = fmt(cords, 2) + ' cords';
    document.getElementById('cubicFeet').textContent = fmt(cubFt, 0) + ' cu ft';
    document.getElementById('weightLbs').textContent = fmt(weight, 0) + ' lbs';
    document.getElementById('costEstimate').textContent = dollar(cost) + ' (at ~$250/cord)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['purpose', 'hours', 'numDays', 'woodType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
