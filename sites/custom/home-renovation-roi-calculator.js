(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var projectType = document.getElementById('projectType').value;
    var projectCost = parseFloat(document.getElementById('projectCost').value) || 0;

    // Calculation logic
    var rois = {kitchen:0.72, bathroom:0.64, deck:0.68, roof:0.61, garage:0.94, siding:0.68, window:0.67}; var roi = rois[projectType] || 0.70; var valueAdd = projectCost * roi; var net = projectCost - valueAdd; document.getElementById('estROI').textContent = pct(roi * 100, 0); document.getElementById('valueAdded').textContent = dollar(valueAdd); document.getElementById('netCost').textContent = dollar(net) + ' net cost';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['projectType', 'projectCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
