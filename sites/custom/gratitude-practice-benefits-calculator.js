(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var frequency = document.getElementById('frequency').value;
    var duration = parseFloat(document.getElementById('duration').value) || 0;
    var items = parseFloat(document.getElementById('items').value) || 0;

    // Calculation logic
    var freqMult = {'Daily': 7, '3-4 times per week': 3.5, 'Weekly': 1, 'Rarely': 0.25}; var sessionsPerWeek = freqMult[frequency] || 1; var totalEntries = Math.round(sessionsPerWeek * duration * items); var consistency = Math.min(sessionsPerWeek / 7 * 100, 100); var wellnessBoost = Math.min(Math.sqrt(duration) * sessionsPerWeek * 1.2, 25);     document.getElementById('consistency').textContent = fmt(consistency,0);
    document.getElementById('wellnessBoost').textContent = fmt(wellnessBoost,0);
    document.getElementById('totalEntries').textContent = fmt(totalEntries,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['frequency', 'duration', 'items'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
