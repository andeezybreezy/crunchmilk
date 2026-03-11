(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hour = parseFloat(document.getElementById('hour').value) || 0;
    var minute = parseFloat(document.getElementById('minute').value) || 0;
    var fromZone = parseFloat(document.getElementById('fromZone').value) || 0;
    var toZone = parseFloat(document.getElementById('toZone').value) || 0;

    // Calculation logic
    var diff = toZone - fromZone; var newHour = ((hour + diff) % 24 + 24) % 24; var dayChange = hour + diff >= 24 ? ' (+1 day)' : hour + diff < 0 ? ' (-1 day)' : ''; var ampm = newHour >= 12 ? 'PM' : 'AM'; var displayHour = newHour > 12 ? newHour - 12 : newHour === 0 ? 12 : newHour; var convertedTime = displayHour + ':' + (minute < 10 ? '0' : '') + minute + ' ' + ampm + dayChange;     document.getElementById('convertedTime').textContent = convertedTime;
    document.getElementById('difference').textContent = (diff >= 0 ? '+' : '') + fmt(diff,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hour', 'minute', 'fromZone', 'toZone'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
