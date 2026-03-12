(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var duration = parseFloat(document.getElementById('duration').value) || 0;
    var latency = parseFloat(document.getElementById('latency').value) || 0;
    var wakeups = parseFloat(document.getElementById('wakeups').value) || 0;
    var restedness = parseFloat(document.getElementById('restedness').value) || 0;

    // Calculation logic
    var durationScore = duration >= 7 && duration <= 9 ? 30 : duration >= 6 ? 20 : 10; var latencyScore = latency <= 15 ? 25 : latency <= 30 ? 15 : 5; var wakeScore = wakeups === 0 ? 20 : wakeups <= 1 ? 15 : wakeups <= 3 ? 8 : 3; var restScore = restedness * 2.5; var score = durationScore + latencyScore + wakeScore + restScore; var rating = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor';     document.getElementById('score').textContent = fmt(score,0);
    document.getElementById('rating').textContent = rating;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['duration', 'latency', 'wakeups', 'restedness'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
