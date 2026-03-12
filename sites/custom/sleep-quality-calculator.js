(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hoursSlept = parseFloat(document.getElementById('hoursSlept').value) || 0;
    var minsToFall = parseFloat(document.getElementById('minsToFall').value) || 0;
    var wakeUps = parseFloat(document.getElementById('wakeUps').value) || 0;
    var restedness = parseFloat(document.getElementById('restedness').value) || 0;

    // Calculation logic
    var durationScore = hoursSlept >= 7 ? 3 : hoursSlept >= 6 ? 2 : hoursSlept >= 5 ? 1 : 0; var latencyScore = minsToFall <= 15 ? 3 : minsToFall <= 30 ? 2 : minsToFall <= 60 ? 1 : 0; var wakeScore = wakeUps === 0 ? 3 : wakeUps <= 1 ? 2 : wakeUps <= 3 ? 1 : 0; var restScore = restedness >= 8 ? 3 : restedness >= 6 ? 2 : restedness >= 4 ? 1 : 0; var total = durationScore + latencyScore + wakeScore + restScore; var maxPossible = 12; var pctScore = (total / maxPossible) * 100; var rating = pctScore >= 80 ? 'Excellent' : pctScore >= 60 ? 'Good' : pctScore >= 40 ? 'Fair' : 'Poor'; var timeInBed = hoursSlept + minsToFall / 60 + wakeUps * 0.17; var efficiency = (hoursSlept / timeInBed) * 100; var tip = hoursSlept < 7 ? 'Increase sleep time — aim for 7-9 hours.' : minsToFall > 30 ? 'Improve sleep onset: limit screens 1hr before bed, keep room cool.' : wakeUps > 2 ? 'Reduce wake-ups: avoid caffeine after 2pm, limit alcohol.' : 'Your sleep habits are solid. Maintain consistency.'; document.getElementById('sleepScore').textContent = total + '/' + maxPossible + ' (' + fmt(pctScore, 0) + '%)'; document.getElementById('rating').textContent = rating; document.getElementById('efficiency').textContent = pct(Math.min(100, efficiency)); document.getElementById('tips').textContent = tip;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hoursSlept', 'minsToFall', 'wakeUps', 'restedness'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
