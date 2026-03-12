(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var principal = parseFloat(document.getElementById('principal').value) || 0;
    var monthly = parseFloat(document.getElementById('monthly').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var r = rate / 100 / 12; var n = years * 12; var fvPrincipal = principal * Math.pow(1 + r, n); var fvMonthly = monthly * ((Math.pow(1 + r, n) - 1) / r); var futureValue = fvPrincipal + fvMonthly; var totalContributions = principal + (monthly * n); var interestEarned = futureValue - totalContributions;     document.getElementById('futureValue').textContent = dollar(futureValue);
    document.getElementById('totalContributions').textContent = dollar(totalContributions);
    document.getElementById('interestEarned').textContent = dollar(interestEarned);

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
