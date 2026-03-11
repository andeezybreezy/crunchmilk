(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sprLevel = parseFloat(document.getElementById('sprLevel').value) || 0;
    var dailyUse = parseFloat(document.getElementById('dailyUse').value) || 0;
    var disruptionPct = parseFloat(document.getElementById('disruptionPct').value) || 0;
    var maxDrawdown = parseFloat(document.getElementById('maxDrawdown').value) || 0;

    // Calculation logic
    var dailyGap = v.dailyUse * (v.disruptionPct / 100); var effectiveRelease = Math.min(v.maxDrawdown, dailyGap); var days = Math.round(v.sprLevel / effectiveRelease); var months = (days / 30.44).toFixed(1); var capacity = 714; var pctFull = (v.sprLevel / capacity * 100).toFixed(1); var depDate = new Date(); depDate.setDate(depDate.getDate() + days); var dateStr = depDate.toLocaleDateString('en-US', {month: 'long', year: 'numeric'}); return {daysOfCover: days + ' days', monthsOfCover: months + ' months', barrelGap: dailyGap.toFixed(1) + ' million bpd', sprPctFull: pctFull + '% of 714M capacity', depletionDate: dateStr};

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
