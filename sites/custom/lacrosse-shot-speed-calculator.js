(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var stickLength = document.getElementById('stickLength').value;
    var armSpeed = document.getElementById('armSpeed').value;
    var technique = document.getElementById('technique').value;
    var weight = parseFloat(document.getElementById('weight').value) || 0;

    // Calculation logic
    var stickLen = parseInt(stickLength);
    var armSpd = parseInt(armSpeed);
    var techFactor = parseFloat(technique);
    var leverFactor = stickLen / 42;
    var strengthFactor = Math.pow(weight / 180, 0.3);
    var baseSpeed = 110;
    var shotMph = baseSpeed * (armSpd / 100) * techFactor * leverFactor * strengthFactor;
    var shotMs = shotMph * 0.4470;
    var ballMass = 0.142;
    var ke = 0.5 * ballMass * shotMs * shotMs;
    var distanceM = 15 * 0.9144;
    var reactionTime = distanceM / shotMs;
    var comparison;
    if (shotMph >= 100) comparison = 'Pro-level speed. Comparable to professional lacrosse.';
    else if (shotMph >= 85) comparison = 'College-level speed. Very competitive.';
    else if (shotMph >= 70) comparison = 'High school varsity level.';
    else comparison = 'Developing player. Focus on technique and core strength.';
    document.getElementById('shotSpeed').textContent = fmt(shotMph, 0) + ' mph (' + fmt(shotMph * 1.609, 0) + ' km/h)';
    document.getElementById('kineticEnergy').textContent = fmt(ke, 1) + ' joules';
    document.getElementById('reactionTime').textContent = fmt(reactionTime * 1000, 0) + ' ms from 15 yards';
    document.getElementById('comparison').textContent = comparison;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['stickLength', 'armSpeed', 'technique', 'weight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
