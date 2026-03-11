(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weightLbs = parseFloat(document.getElementById('weightLbs').value) || 0;
    var ageMonths = parseFloat(document.getElementById('ageMonths').value) || 0;

    // Calculation logic
    var ozDay = Math.min(weightLbs * 2.5, 32); if (ageMonths >= 6) ozDay = Math.min(ozDay, 28); var feeds = ageMonths < 1 ? 10 : ageMonths < 3 ? 8 : ageMonths < 6 ? 6 : 5; var perFeed = ozDay / feeds; var scoopsDay = ozDay / 2; var gramsDay = scoopsDay * 8.7; var tinsMonth = (gramsDay * 30) / 354; document.getElementById('ozPerDay').textContent = fmt(ozDay, 0) + ' oz'; document.getElementById('ozPerFeed').textContent = fmt(perFeed, 1) + ' oz every ' + fmt(24/feeds, 1) + ' hours'; document.getElementById('feedsPerDay').textContent = feeds + ' times/day'; document.getElementById('monthlyTins').textContent = fmt(tinsMonth, 1) + ' cans (~' + dollar(tinsMonth * 20) + '/month)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weightLbs', 'ageMonths'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
