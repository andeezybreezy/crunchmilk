(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var minutes = parseFloat(document.getElementById('minutes').value) || 0;
    var seconds = parseFloat(document.getElementById('seconds').value) || 0;

    // Calculation logic
    var totalSec = minutes * 60 + seconds; var secPer100 = (totalSec / distance) * 100; var secPer50 = secPer100 / 2; var speedMph = (distance / totalSec) * 2.23694; var paceMin100 = Math.floor(secPer100 / 60); var paceSec100 = Math.round(secPer100 % 60); var paceMin50 = Math.floor(secPer50 / 60); var paceSec50 = Math.round(secPer50 % 60); document.getElementById('pace100').textContent = paceMin100 + ':' + paceSec100.toString().padStart(2, '0') + ' /100m'; document.getElementById('pace50').textContent = paceMin50 + ':' + paceSec50.toString().padStart(2, '0') + ' /50m'; document.getElementById('totalSec').textContent = minutes + ':' + seconds.toString().padStart(2, '0'); document.getElementById('speed').textContent = fmt(speedMph, 2) + ' mph';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['distance', 'minutes', 'seconds'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
