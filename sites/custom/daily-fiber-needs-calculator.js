(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var age = parseFloat(document.getElementById('age').value) || 0;
    var sex = document.getElementById('sex').value;
    var calories = parseFloat(document.getElementById('calories').value) || 0;

    // Calculation logic
    var rec; if (age <= 3) rec = 19; else if (age <= 8) rec = 25; else if (age <= 13) rec = sex === 'Male' ? 31 : 26; else if (age <= 50) rec = sex === 'Male' ? 38 : 25; else rec = sex === 'Male' ? 30 : 21; var minimum = calories * 0.014; var sources = fmt(rec/5,0) + ' apples or ' + fmt(rec/8,0) + ' cups of beans';     document.getElementById('recommendation').textContent = fmt(rec,0);
    document.getElementById('minimum').textContent = fmt(minimum,0);
    document.getElementById('sources').textContent = sources;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['age', 'sex', 'calories'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
