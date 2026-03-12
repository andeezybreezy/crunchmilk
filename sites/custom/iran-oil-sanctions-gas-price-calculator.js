(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var policyChange = document.getElementById('policyChange').value;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var monthlyMiles = parseFloat(document.getElementById('monthlyMiles').value) || 0;

    // Calculation logic
    var impacts = {tighten: {supply: -1.5, oilPct: 8, desc: '-1.5M bpd from market'}, maintain: {supply: 0, oilPct: 0, desc: 'No change'}, loosen: {supply: 0.8, oilPct: -4, desc: '+0.8M bpd to market'}, lift: {supply: 1.5, oilPct: -8, desc: '+1.5M bpd to market'}}; var i = impacts[policyChange]; var gasChange = i.oilPct / 100 * 0.6; var newGas = gasPrice * (1 + gasChange); var gallonsPerMonth = monthlyMiles / 25; var monthlyCost = gallonsPerMonth * (newGas - gasPrice); var sign = monthlyCost >= 0 ? '+' : '';     document.getElementById('supplyChange').textContent = i.desc;
    document.getElementById('oilPriceChange').textContent = (i.oilPct >= 0 ? '+' : '') + i.oilPct + '% crude price';
    document.getElementById('newGasPrice').textContent = '$' + newGas.toFixed(2) + '/gal';
    document.getElementById('monthlyCostChange').textContent = sign + '$' + monthlyCost.toFixed(0) + '/mo';
    document.getElementById('annualCostChange').textContent = sign + '$' + Math.round(monthlyCost * 12) + '/yr';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['policyChange', 'gasPrice', 'monthlyMiles'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
