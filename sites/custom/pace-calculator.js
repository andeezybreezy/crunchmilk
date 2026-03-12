(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var hours = parseFloat(document.getElementById('hours').value) || 0;
    var minutes = parseFloat(document.getElementById('minutes').value) || 0;
    var seconds = parseFloat(document.getElementById('seconds').value) || 0;

    // Calculation logic
    var totalSeconds = hours*3600 + minutes*60 + seconds; var paceSeconds = totalSeconds / distance; var paceMin = Math.floor(paceSeconds / 60); var paceSec = Math.floor(paceSeconds % 60); var pace = paceMin + ':' + (paceSec < 10 ? '0' : '') + paceSec; var speed = distance / (totalSeconds / 3600); var marathonSec = paceSeconds * 26.2; var mHrs = Math.floor(marathonSec / 3600); var mMin = Math.floor((marathonSec % 3600) / 60); var marathon = mHrs + ':' + (mMin < 10 ? '0' : '') + mMin;     document.getElementById('pace').textContent = pace;
    document.getElementById('speed').textContent = fmt(speed,1);
    document.getElementById('marathon').textContent = marathon;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['distance', 'hours', 'minutes', 'seconds'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
