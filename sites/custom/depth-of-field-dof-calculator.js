(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var focal = parseFloat(document.getElementById('focal').value) || 0;
    var aperture = parseFloat(document.getElementById('aperture').value) || 0;
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var sensor = document.getElementById('sensor').value;

    // Calculation logic
    var coc = {'Full Frame': 0.03, 'APS-C': 0.02, 'Micro 4/3': 0.015}; var c = coc[sensor] || 0.03; var distMM = distance * 304.8; var h = (focal * focal) / (aperture * c); var nearLimit = (distMM * (h - focal)) / (h + distMM - 2*focal); var farLimit = (distMM * (h - focal)) / (h - distMM); if (farLimit < 0) farLimit = Infinity; var dof = farLimit === Infinity ? 'Infinite' : fmt((farLimit - nearLimit)/304.8, 2); nearLimit = nearLimit / 304.8; farLimit = farLimit === Infinity ? 'Infinity' : fmt(farLimit/304.8, 1);     document.getElementById('dof').textContent = dof;
    document.getElementById('nearLimit').textContent = fmt(nearLimit,1);
    document.getElementById('farLimit').textContent = farLimit;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['focal', 'aperture', 'distance', 'sensor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
