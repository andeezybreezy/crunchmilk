(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var windDirection = parseFloat(document.getElementById('windDirection').value) || 0;
    var windSpeed = parseFloat(document.getElementById('windSpeed').value) || 0;
    var gustSpeed = parseFloat(document.getElementById('gustSpeed').value) || 0;
    var runwayHeading = parseFloat(document.getElementById('runwayHeading').value) || 0;
    var crosswindLimit = parseFloat(document.getElementById('crosswindLimit').value) || 0;

    // Calculation logic
    var angleDeg = windDirection - runwayHeading; var angleRad = angleDeg * Math.PI / 180; var crosswind = Math.abs(windSpeed * Math.sin(angleRad)); var headwind = windSpeed * Math.cos(angleRad); var gustCross = gustSpeed > 0 ? Math.abs(gustSpeed * Math.sin(angleRad)) : 0; var absAngle = Math.abs(((angleDeg + 180) % 360) - 180); var isHeadwind = headwind > 0; var hwLabel = isHeadwind ? fmt(Math.abs(headwind), 0) + ' kt headwind' : fmt(Math.abs(headwind), 0) + ' kt TAILWIND'; var maxCross = gustSpeed > 0 ? gustCross : crosswind; var withinLimits = maxCross <= crosswindLimit; var limitMsg = withinLimits ? 'YES — ' + fmt(crosswindLimit - maxCross, 0) + ' kts under limit' : 'NO — Exceeds limit by ' + fmt(maxCross - crosswindLimit, 0) + ' kts'; var sinAngle = Math.sin(angleRad); var dir = sinAngle > 0.01 ? 'Right' : sinAngle < -0.01 ? 'Left' : 'Direct head/tail'; document.getElementById('crosswindComp').textContent = fmt(crosswind, 0) + ' kts'; document.getElementById('headwindComp').textContent = hwLabel; document.getElementById('gustCrosswind').textContent = gustSpeed > 0 ? fmt(gustCross, 0) + ' kts (gusting)' : 'No gusts reported'; document.getElementById('windAngle').textContent = fmt(absAngle, 0) + ' degrees'; document.getElementById('withinLimits').textContent = limitMsg; document.getElementById('direction').textContent = dir;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['windDirection', 'windSpeed', 'gustSpeed', 'runwayHeading', 'crosswindLimit'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
