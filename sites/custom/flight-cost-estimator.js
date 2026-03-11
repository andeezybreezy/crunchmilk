(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var class = document.getElementById('class').value;
    var timing = document.getElementById('timing').value;

    // Calculation logic
    var baseCPM=distance<500?0.20:distance<1500?0.12:distance<3000?0.10:0.08; var classMultiplier={economy:1,premium:1.7,business:3.5,first:6}; var timingMultiplier={lastmin:1.8,short:1.3,advance:1,early:0.9}; var oneWay=distance*baseCPM*classMultiplier[class]*timingMultiplier[timing]; oneWay=Math.max(oneWay,49); var roundTrip=oneWay*1.8; var perMile=oneWay/distance; return {estimate:dollar(oneWay), roundTrip:dollar(roundTrip), perMile:'$'+fmt(perMile,3)+'/mile'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['distance', 'class', 'timing'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
