(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var ageMonths = parseFloat(document.getElementById('ageMonths').value) || 0;
    var weightLbs = parseFloat(document.getElementById('weightLbs').value) || 0;
    var gender = document.getElementById('gender').value;

    // Calculation logic
    var avgBoy = [7.5,9.6,11.5,13.0,14.3,15.4,16.4,17.3,18.1,18.8,19.4,20.0,20.5,21.0,21.5,22.0,22.5,23.0,23.4,23.8,24.3,24.7,25.1,25.5,25.9]; var avgGirl = [7.1,9.0,10.8,12.2,13.4,14.5,15.4,16.2,17.0,17.7,18.3,18.8,19.3,19.8,20.3,20.7,21.1,21.5,22.0,22.4,22.8,23.2,23.6,24.0,24.4]; var avgs = gender === 'boy' ? avgBoy : avgGirl; var idx = Math.min(Math.round(ageMonths), 24); var avgW = avgs[idx]; var zScore = (weightLbs - avgW) / (avgW * 0.12); var pctile = Math.min(99, Math.max(1, Math.round(50 + zScore * 20))); var cat = pctile < 5 ? 'Below 5th — discuss with pediatrician' : pctile < 25 ? 'Lower range — likely normal' : pctile < 75 ? 'Average range' : pctile < 95 ? 'Upper range — likely normal' : 'Above 95th — discuss with pediatrician'; document.getElementById('percentile').textContent = pctile + 'th percentile'; document.getElementById('category').textContent = cat; document.getElementById('avg').textContent = fmt(avgW, 1) + ' lbs (50th percentile)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['ageMonths', 'weightLbs', 'gender'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
