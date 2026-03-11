(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var startYear = parseFloat(document.getElementById('startYear').value) || 0;
    var endYear = parseFloat(document.getElementById('endYear').value) || 0;
    var annualInflation = parseFloat(document.getElementById('annualInflation').value) || 0;

    // Calculation logic
    var years=endYear-startYear; var cumInflation=Math.pow(1+annualInflation/100,years); var equivalentToday=amount*cumInflation; var lost=equivalentToday-amount; var retained=(amount/equivalentToday)*100; return {equivalentToday:dollar(equivalentToday), purchasingPowerLost:dollar(lost), cumulativeInflation:fmt((cumInflation-1)*100,1)+'%', realReturn:fmt(retained,1)+'% retained'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'startYear', 'endYear', 'annualInflation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
