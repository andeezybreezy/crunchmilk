(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var refreshRate = parseFloat(document.getElementById('refreshRate').value) || 0;
    var responseTime = parseFloat(document.getElementById('responseTime').value) || 0;
    var inputLag = parseFloat(document.getElementById('inputLag').value) || 0;
    var systemLatency = parseFloat(document.getElementById('systemLatency').value) || 0;

    // Calculation logic
    var frameTime = 1000 / refreshRate;
    var totalLat = systemLatency + inputLag + (frameTime / 2);
    var clarity = responseTime <= frameTime ? 'Excellent — response faster than frame time' : 'Good — some ghosting possible at ' + fmt(refreshRate, 0) + ' Hz';
    if (responseTime > frameTime * 2) clarity = 'Poor — significant ghosting, consider faster panel';
    var compRating = totalLat < 20 ? 'Elite — tournament-grade responsiveness' : (totalLat < 35 ? 'Great — competitive advantage' : (totalLat < 50 ? 'Good — fine for ranked play' : 'Casual — noticeable delay in fast-paced games'));
    document.getElementById('frameTime').textContent = fmt(frameTime, 2) + ' ms per frame at ' + fmt(refreshRate, 0) + ' Hz';
    document.getElementById('totalLatency').textContent = fmt(totalLat, 1) + ' ms total';
    document.getElementById('motionClarity').textContent = clarity;
    document.getElementById('competitive').textContent = compRating;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['refreshRate', 'responseTime', 'inputLag', 'systemLatency'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
