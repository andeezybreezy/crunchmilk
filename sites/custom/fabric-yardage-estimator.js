(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var project = document.getElementById('project').value;
    var sizeRange = document.getElementById('sizeRange').value;

    // Calculation logic
    var yards = {dress:{small:2.5,med:3,large:3.5,plus:4.5},shirt:{small:2,med:2.25,large:2.75,plus:3.5},pants:{small:2,med:2.25,large:2.75,plus:3.25},skirt:{small:1.5,med:2,large:2.5,plus:3},quilt:{small:5,med:5,large:5,plus:5},curtain:{small:4,med:4,large:4,plus:4}}; var yd45 = (yards[project]||yards.dress)[sizeRange]||3; var yd60 = yd45 * 0.75; document.getElementById('yardage45').textContent = fmt(yd45, 1) + ' yards'; document.getElementById('yardage60').textContent = fmt(yd60, 1) + ' yards'; document.getElementById('estCost').textContent = dollar(yd45 * 10) + ' - ' + dollar(yd45 * 15);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['project', 'sizeRange'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
