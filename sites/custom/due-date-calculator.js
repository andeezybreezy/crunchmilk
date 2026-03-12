(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var lmpMonth = parseFloat(document.getElementById('lmpMonth').value) || 0;
    var lmpDay = parseFloat(document.getElementById('lmpDay').value) || 0;
    var lmpYear = parseFloat(document.getElementById('lmpYear').value) || 0;

    // Calculation logic
    var lmp = new Date(lmpYear, lmpMonth - 1, lmpDay); var due = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000); var today = new Date(); var diffMs = today - lmp; var weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)); var days = Math.floor((diffMs % (7 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)); var tri = weeks < 13 ? 'First Trimester' : weeks < 27 ? 'Second Trimester' : weeks <= 42 ? 'Third Trimester' : 'Past due date'; var opts = {weekday:'long',month:'long',day:'numeric',year:'numeric'}; document.getElementById('dueDate').textContent = due.toLocaleDateString('en-US', opts); document.getElementById('weeksNow').textContent = weeks >= 0 && weeks <= 42 ? weeks + ' weeks, ' + days + ' days' : 'Check your dates'; document.getElementById('trimester').textContent = tri;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['lmpMonth', 'lmpDay', 'lmpYear'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
