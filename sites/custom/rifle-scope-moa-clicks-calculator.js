(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dropInches = parseFloat(document.getElementById('dropInches').value) || 0;
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var clickValue = document.getElementById('clickValue').value;

    // Calculation logic
    var inchesPerMOA = distance * 1.047 / 100; var moaAdj = dropInches / inchesPerMOA; var clickValues = {'1/4 MOA': 0.25, '1/2 MOA': 0.5, '1/8 MOA': 0.125, '0.1 MRAD': 0.36}; var cv = clickValues[clickValue] || 0.25; var clicks = Math.round(moaAdj / cv);     document.getElementById('moaAdj').textContent = fmt(moaAdj,1);
    document.getElementById('clicks').textContent = fmt(clicks,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dropInches', 'distance', 'clickValue'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
