(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var principal = parseFloat(document.getElementById('principal').value) || 0;
    var monthly = parseFloat(document.getElementById('monthly').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var r = rate / 100 / 12; var n = years * 12; var fvPrincipal = principal * Math.pow(1 + r, n); var fvMonthly = monthly * ((Math.pow(1 + r, n) - 1) / r); var futureValue = fvPrincipal + fvMonthly; var totalContributions = principal + (monthly * n); var interestEarned = futureValue - totalContributions; return {futureValue: dollar(futureValue), totalContributions: dollar(totalContributions), interestEarned: dollar(interestEarned)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['principal', 'monthly', 'rate', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
