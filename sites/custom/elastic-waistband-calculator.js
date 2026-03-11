(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bodyMeasure = parseFloat(document.getElementById('bodyMeasure').value) || 0;
    var elasticType = document.getElementById('elasticType').value;
    var overlap = parseFloat(document.getElementById('overlap').value) || 0;

    // Calculation logic
    var ratios = {'Regular Knit': 0.85, 'Woven Non-Roll': 0.90, 'Fold-Over': 0.80, 'Clear Elastic': 0.75}; var ratio = ratios[elasticType] || 0.85; var cutLength = (bodyMeasure * ratio) + overlap; var stretchRatio = ((1/ratio) - 1) * 100; return {cutLength: fmt(cutLength,1), stretchRatio: fmt(stretchRatio,0)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bodyMeasure', 'elasticType', 'overlap'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
