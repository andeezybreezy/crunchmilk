(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dailyUsers = parseFloat(document.getElementById('dailyUsers').value) || 0;
    var reqPerUser = parseFloat(document.getElementById('reqPerUser').value) || 0;
    var peakMultiplier = parseFloat(document.getElementById('peakMultiplier').value) || 0;
    var avgLatency = parseFloat(document.getElementById('avgLatency').value) || 0;

    // Calculation logic
    var dailyRequests=dailyUsers*reqPerUser; var avgRps=dailyRequests/86400; var peakRps=avgRps*peakMultiplier; var concurrency=Math.ceil(peakRps*(avgLatency/1000));     document.getElementById('dailyRequests').textContent = fmt(dailyRequests,0);
    document.getElementById('avgRps').textContent = fmt(avgRps,1)+' req/sec';
    document.getElementById('peakRps').textContent = fmt(peakRps,1)+' req/sec';
    document.getElementById('concurrency').textContent = concurrency+' connections';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dailyUsers', 'reqPerUser', 'peakMultiplier', 'avgLatency'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
