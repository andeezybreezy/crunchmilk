(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sprLevel = parseFloat(document.getElementById('sprLevel').value) || 0;
    var dailyUse = parseFloat(document.getElementById('dailyUse').value) || 0;
    var disruptionPct = parseFloat(document.getElementById('disruptionPct').value) || 0;
    var maxDrawdown = parseFloat(document.getElementById('maxDrawdown').value) || 0;

    // Calculation logic
    var dailyGap = dailyUse * (disruptionPct / 100); var effectiveRelease = Math.min(maxDrawdown, dailyGap); var days = Math.round(sprLevel / effectiveRelease); var months = (days / 30.44).toFixed(1); var capacity = 714; var pctFull = (sprLevel / capacity * 100).toFixed(1); var depDate = new Date(); depDate.setDate(depDate.getDate() + days); var dateStr = depDate.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});     document.getElementById('daysOfCover').textContent = days + ' days';
    document.getElementById('monthsOfCover').textContent = months + ' months';
    document.getElementById('barrelGap').textContent = dailyGap.toFixed(1) + ' million bpd';
    document.getElementById('sprPctFull').textContent = pctFull + '% of 714M capacity';
    document.getElementById('depletionDate').textContent = dateStr;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sprLevel', 'dailyUse', 'disruptionPct', 'maxDrawdown'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
