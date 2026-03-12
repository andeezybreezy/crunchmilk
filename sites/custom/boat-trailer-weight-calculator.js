(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var boatWeight = parseFloat(document.getElementById('boatWeight').value) || 0;
    var fuel = parseFloat(document.getElementById('fuel').value) || 0;
    var gear = parseFloat(document.getElementById('gear').value) || 0;
    var trailerWeight = parseFloat(document.getElementById('trailerWeight').value) || 0;

    // Calculation logic
    var fuelWeight = fuel * 6.1; var loadedBoat = boatWeight + fuelWeight + gear; var total = loadedBoat + trailerWeight; var tongue = total * 0.10; document.getElementById('totalTow').textContent = fmt(total, 0) + ' lbs'; document.getElementById('tongueWeight').textContent = fmt(tongue, 0) + ' lbs'; document.getElementById('minTowRating').textContent = fmt(total * 1.15, 0) + ' lbs'; document.getElementById('boatLoaded').textContent = fmt(loadedBoat, 0) + ' lbs'; document.getElementById('resultTip').textContent = 'Tow vehicle should be rated 15%+ above total tow weight for safety margin.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['boatWeight', 'fuel', 'gear', 'trailerWeight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
