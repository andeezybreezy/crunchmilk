(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var uvIndex = parseFloat(document.getElementById('uvIndex').value) || 0;
    var skinType = document.getElementById('skinType').value;
    var spf = parseFloat(document.getElementById('spf').value) || 0;

    // Calculation logic
    var baseMins = {1: 67, 2: 100, 3: 200, 4: 300, 5: 400, 6: 500}; var base = baseMins[skinType] || 200; var burnMin = base / uvIndex; var protectedMin = burnMin * spf * 0.5; var cat = uvIndex <= 2 ? 'Low' : uvIndex <= 5 ? 'Moderate' : uvIndex <= 7 ? 'High' : uvIndex <= 10 ? 'Very High' : 'Extreme'; document.getElementById('burnTime').textContent = fmt(burnMin, 0) + ' minutes'; document.getElementById('protectedTime').textContent = fmt(Math.min(protectedMin, 480), 0) + ' minutes (' + fmt(Math.min(protectedMin, 480) / 60, 1) + ' hours)'; document.getElementById('uvCategory').textContent = cat + ' (UV ' + uvIndex + ')'; document.getElementById('resultTip').textContent = 'Reapply sunscreen every 2 hours regardless of SPF.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['uvIndex', 'skinType', 'spf'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
