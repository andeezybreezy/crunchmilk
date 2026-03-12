(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var students = parseFloat(document.getElementById('students').value) || 0;
    var teachers = parseFloat(document.getElementById('teachers').value) || 0;
    var aides = parseFloat(document.getElementById('aides').value) || 0;

    // Calculation logic
    var ratio = students / teachers; var effectiveRatio = students / (teachers + aides * 0.5); var rating = effectiveRatio <= 12 ? 'Excellent' : effectiveRatio <= 18 ? 'Good' : effectiveRatio <= 24 ? 'Average' : 'Needs Improvement';     document.getElementById('ratio').textContent = fmt(ratio,1);
    document.getElementById('effectiveRatio').textContent = fmt(effectiveRatio,1);
    document.getElementById('rating').textContent = rating;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['students', 'teachers', 'aides'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
