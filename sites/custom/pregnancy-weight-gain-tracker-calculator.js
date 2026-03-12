(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var preBmi = parseFloat(document.getElementById('preBmi').value) || 0;
    var weeks = parseFloat(document.getElementById('weeks').value) || 0;

    // Calculation logic
    var ranges = preBmi < 18.5 ? [28,40] : preBmi < 25 ? [25,35] : preBmi < 30 ? [15,25] : [11,20]; var weeklyRate = preBmi < 25 ? 1 : 0.6; var firstTri = weeks <= 13 ? weeks * 0.3 : 4; var laterWeeks = Math.max(weeks - 13, 0); var recommended = firstTri + laterWeeks * weeklyRate; var totalRange = ranges[0] + '-' + ranges[1];     document.getElementById('recommended').textContent = fmt(recommended,1);
    document.getElementById('totalRange').textContent = totalRange;
    document.getElementById('weeklyRate').textContent = fmt(weeklyRate,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['preBmi', 'weeks'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
