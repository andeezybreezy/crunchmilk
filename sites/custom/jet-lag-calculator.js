(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var zonesCrossed = parseFloat(document.getElementById('zonesCrossed').value) || 0;
    var direction = document.getElementById('direction').value;

    // Calculation logic
    var daysPerZone=direction==='east'?1.5:1; var recoveryDays=Math.ceil(zonesCrossed*daysPerZone); var adjustHours=zonesCrossed; var tip=direction==='east'?'Start going to bed 30 min earlier each night a few days before travel. Seek morning sunlight at destination.':'Stay up until local bedtime on arrival. Seek afternoon/evening sunlight.';     document.getElementById('recoveryDays').textContent = recoveryDays+' days';
    document.getElementById('adjustHours').textContent = adjustHours+' hour body clock shift';
    document.getElementById('tip').textContent = tip;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['zonesCrossed', 'direction'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
