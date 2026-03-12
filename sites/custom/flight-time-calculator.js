(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var aircraftType = document.getElementById('aircraftType').value;
    var cruiseSpeed = parseFloat(document.getElementById('cruiseSpeed').value) || 0;
    var windSpeed = parseFloat(document.getElementById('windSpeed').value) || 0;
    var climbDescent = parseFloat(document.getElementById('climbDescent').value) || 0;

    // Calculation logic
    var defaultSpeeds = {single:130,twin:180,turboprop:250,light_jet:400,airliner:480}; var tas = cruiseSpeed > 0 ? cruiseSpeed : (defaultSpeeds[aircraftType] || 130); var gs = tas - windSpeed; gs = Math.max(gs, 30); var enrouteMin = (distance / gs) * 60; var totalMin = enrouteMin + climbDescent; var hobbsMin = totalMin + 10; var hours = Math.floor(totalMin / 60); var mins = Math.round(totalMin % 60); var enrouteH = Math.floor(enrouteMin / 60); var enrouteM = Math.round(enrouteMin % 60); var hobbsH = Math.floor(hobbsMin / 60); var hobbsM = Math.round(hobbsMin % 60); var note = windSpeed > 20 ? 'Strong headwind — consider altitude change for better winds' : windSpeed < -20 ? 'Strong tailwind — favorable conditions' : 'Normal wind conditions'; if(distance > 1000 && (aircraftType === 'single' || aircraftType === 'twin')) { note = 'Long distance — verify fuel range and plan fuel stops'; } document.getElementById('groundSpeed').textContent = fmt(gs, 0) + ' kts'; document.getElementById('enrouteTime').textContent = enrouteH + 'h ' + enrouteM + 'm (cruise only)'; document.getElementById('totalTime').textContent = hours + 'h ' + mins + 'm'; document.getElementById('hobbsTime').textContent = hobbsH + 'h ' + hobbsM + 'm (incl. taxi)'; document.getElementById('etaNote').textContent = note;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['distance', 'aircraftType', 'cruiseSpeed', 'windSpeed', 'climbDescent'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
