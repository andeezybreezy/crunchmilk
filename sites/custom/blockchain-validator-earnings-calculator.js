(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var stakeAmount = parseFloat(document.getElementById('stakeAmount').value) || 0;
    var networkApr = parseFloat(document.getElementById('networkApr').value) || 0;
    var uptime = parseFloat(document.getElementById('uptime').value) || 0;
    var ethPrice = parseFloat(document.getElementById('ethPrice').value) || 0;
    var electricityCost = parseFloat(document.getElementById('electricityCost').value) || 0;

    // Calculation logic
    var grossEth = stakeAmount * (networkApr / 100) * (uptime / 100); var annualUsd = grossEth * ethPrice; var annualCosts = electricityCost * 12; var monthlyNet = (annualUsd - annualCosts) / 12; var effectiveApr = ((annualUsd - annualCosts) / (stakeAmount * ethPrice)) * 100;     document.getElementById('annualEth').textContent = fmt(grossEth, 2);
    document.getElementById('annualUsd').textContent = dollar(annualUsd);
    document.getElementById('monthlyNet').textContent = dollar(monthlyNet);
    document.getElementById('effectiveApr').textContent = fmt(effectiveApr, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['stakeAmount', 'networkApr', 'uptime', 'ethPrice', 'electricityCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
