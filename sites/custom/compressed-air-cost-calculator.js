(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hp = parseFloat(document.getElementById('hp').value) || 0;
    var hours = parseFloat(document.getElementById('hours').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;

    // Calculation logic
    var kw = hp * 0.746; var monthlyKwh = kw * hours; var monthlyCost = monthlyKwh * rate; var annualCost = monthlyCost * 12;     document.getElementById('monthlyCost').textContent = dollar(monthlyCost);
    document.getElementById('annualCost').textContent = dollar(annualCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hp', 'hours', 'rate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
