(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentOil = parseFloat(document.getElementById('currentOil').value) || 0;
    var peacePrice = parseFloat(document.getElementById('peacePrice').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var monthlyMiles = parseFloat(document.getElementById('monthlyMiles').value) || 0;

    // Calculation logic
    var premium = currentOil - peacePrice; var pct = (premium / currentOil * 100); var gasPremium = (premium / currentOil) * gasPrice * 0.6; var gallons = monthlyMiles / 25; var monthly = gallons * gasPremium;     document.getElementById('warPremium').textContent = '$' + premium.toFixed(0) + '/barrel';
    document.getElementById('premiumPct').textContent = pct.toFixed(1) + '%';
    document.getElementById('gasPremium').textContent = '$' + gasPremium.toFixed(2) + '/gal';
    document.getElementById('monthlyWarCost').textContent = '$' + monthly.toFixed(0) + '/mo';
    document.getElementById('annualWarCost').textContent = '$' + Math.round(monthly * 12) + '/yr';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentOil', 'peacePrice', 'gasPrice', 'monthlyMiles'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
