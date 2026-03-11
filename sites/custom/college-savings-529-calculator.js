(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var current = parseFloat(document.getElementById('current').value) || 0;
    var monthly = parseFloat(document.getElementById('monthly').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;
    var returnRate = parseFloat(document.getElementById('returnRate').value) || 0;

    // Calculation logic
    var r = returnRate / 100 / 12; var n = years * 12; var fvLump = current * Math.pow(1 + r, n); var fvMonthly = monthly * ((Math.pow(1 + r, n) - 1) / r); var futureValue = fvLump + fvMonthly; var totalContributions = current + (monthly * n); var earnings = futureValue - totalContributions; return {futureValue: dollar(futureValue), totalContributions: dollar(totalContributions), earnings: dollar(earnings)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['current', 'monthly', 'years', 'returnRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
