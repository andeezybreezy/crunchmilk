(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var stressLevel = parseFloat(document.getElementById('stressLevel').value) || 0;
    var duration = document.getElementById('duration').value;
    var copingTools = document.getElementById('copingTools').value;

    // Calculation logic
    var baseDays = {'Acute (hours)': 1, 'Short-term (days)': 7, 'Chronic (weeks/months)': 30}; var base = baseDays[duration] || 7; var severityMult = stressLevel / 5; var copingMult = {'Many (exercise, therapy, support)': 0.6, 'Some (1-2 methods)': 1, 'Few (limited resources)': 1.5}; var recoveryDays = Math.ceil(base * severityMult * (copingMult[copingTools] || 1)); var priority = stressLevel >= 7 ? 'Seek professional support, prioritize sleep and movement' : 'Focus on rest, social connection, and routine';     document.getElementById('recoveryDays').textContent = fmt(recoveryDays,0);
    document.getElementById('priority').textContent = priority;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['stressLevel', 'duration', 'copingTools'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
