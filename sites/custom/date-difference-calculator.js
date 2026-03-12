(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var year1 = parseFloat(document.getElementById('year1').value) || 0;
    var month1 = parseFloat(document.getElementById('month1').value) || 0;
    var day1 = parseFloat(document.getElementById('day1').value) || 0;
    var year2 = parseFloat(document.getElementById('year2').value) || 0;
    var month2 = parseFloat(document.getElementById('month2').value) || 0;
    var day2 = parseFloat(document.getElementById('day2').value) || 0;

    // Calculation logic
    var d1 = new Date(year1, month1-1, day1); var d2 = new Date(year2, month2-1, day2); var diff = Math.abs(d2 - d1); var days = Math.floor(diff / (1000*60*60*24)); var weeks = Math.floor(days / 7); var months = days / 30.44;     document.getElementById('days').textContent = fmt(days,0);
    document.getElementById('weeks').textContent = fmt(weeks,0);
    document.getElementById('months').textContent = fmt(months,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['year1', 'month1', 'day1', 'year2', 'month2', 'day2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
