(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
    var costBase = parseFloat(document.getElementById('costBase').value) || 0;
    var holdingPeriod = document.getElementById('holdingPeriod').value;
    var otherIncome = parseFloat(document.getElementById('otherIncome').value) || 0;
    var capitalLosses = parseFloat(document.getElementById('capitalLosses').value) || 0;

    // Calculation logic
    var totalGainVal = Math.max(0, salePrice - costBase);
    var netGainVal = Math.max(0, totalGainVal - capitalLosses);
    var discountVal = 0;
    var taxableGainVal = netGainVal;
    if (holdingPeriod === 'over12' && netGainVal > 0) {
      discountVal = netGainVal * 0.50;
      taxableGainVal = netGainVal * 0.50;
    }
    var totalIncome = otherIncome + taxableGainVal;
    var taxWithGain = 0;
    if (totalIncome <= 18200) taxWithGain = 0;
    else if (totalIncome <= 45000) taxWithGain = (totalIncome - 18200) * 0.16;
    else if (totalIncome <= 135000) taxWithGain = 4288 + (totalIncome - 45000) * 0.30;
    else if (totalIncome <= 190000) taxWithGain = 31288 + (totalIncome - 135000) * 0.37;
    else taxWithGain = 51638 + (totalIncome - 190000) * 0.45;
    var taxWithout = 0;
    if (otherIncome <= 18200) taxWithout = 0;
    else if (otherIncome <= 45000) taxWithout = (otherIncome - 18200) * 0.16;
    else if (otherIncome <= 135000) taxWithout = 4288 + (otherIncome - 45000) * 0.30;
    else if (otherIncome <= 190000) taxWithout = 31288 + (otherIncome - 135000) * 0.37;
    else taxWithout = 51638 + (otherIncome - 190000) * 0.45;
    var cgtPayableVal = taxWithGain - taxWithout;
    var margRate = 0;
    if (totalIncome <= 18200) margRate = 0;
    else if (totalIncome <= 45000) margRate = 16;
    else if (totalIncome <= 135000) margRate = 30;
    else if (totalIncome <= 190000) margRate = 37;
    else margRate = 45;
    document.getElementById('totalGain').textContent = 'A$' + totalGainVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('netGain').textContent = 'A$' + netGainVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('cgtDiscount').textContent = holdingPeriod === 'over12' ? 'A$' + discountVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A (held < 12 months)';
    document.getElementById('taxableGain').textContent = 'A$' + taxableGainVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('marginalRate').textContent = margRate + '%';
    document.getElementById('cgtPayable').textContent = 'A$' + cgtPayableVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['salePrice', 'costBase', 'holdingPeriod', 'otherIncome', 'capitalLosses'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
