(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var zonesCrossed = parseFloat(document.getElementById('zonesCrossed').value) || 0;
    var direction = document.getElementById('direction').value;

    // Calculation logic
    var daysPerZone=direction==='east'?1.5:1; var recoveryDays=Math.ceil(zonesCrossed*daysPerZone); var adjustHours=zonesCrossed; var tip=direction==='east'?'Start going to bed 30 min earlier each night a few days before travel. Seek morning sunlight at destination.':'Stay up until local bedtime on arrival. Seek afternoon/evening sunlight.'; return {recoveryDays:recoveryDays+' days', adjustHours:adjustHours+' hour body clock shift', tip:tip};

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
