(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var jointLength = parseFloat(document.getElementById('jointLength').value) || 0;
    var rodLength = parseFloat(document.getElementById('rodLength').value) || 0;
    var passes = parseFloat(document.getElementById('passes').value) || 0;

    // Calculation logic
    var deposition = rodLength * 0.6; var rodsNeeded = Math.ceil((jointLength * passes) / deposition); var totalWeight = rodsNeeded * 0.12; return {rodsNeeded: fmt(rodsNeeded,0), totalWeight: fmt(totalWeight,1)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['jointLength', 'rodLength', 'passes'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
