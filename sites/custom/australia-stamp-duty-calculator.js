(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var propertyValue = parseFloat(document.getElementById('propertyValue').value) || 0;
    var state = document.getElementById('state').value;
    var propertyType = document.getElementById('propertyType').value;
    var firstHomeBuyer = document.getElementById('firstHomeBuyer').value;
    var foreignBuyer = document.getElementById('foreignBuyer').value;

    // Calculation logic
    var price = propertyValue;
    var duty = 0;
    if (state === 'NSW') {
      if (price <= 17000) duty = price * 0.0125;
      else if (price <= 36000) duty = 212 + (price - 17000) * 0.015;
      else if (price <= 97000) duty = 497 + (price - 36000) * 0.0175;
      else if (price <= 364000) duty = 1564 + (price - 97000) * 0.035;
      else if (price <= 1214000) duty = 10909 + (price - 364000) * 0.045;
      else duty = 49159 + (price - 1214000) * 0.055;
    } else if (state === 'VIC') {
      if (price <= 25000) duty = price * 0.014;
      else if (price <= 130000) duty = 350 + (price - 25000) * 0.024;
      else if (price <= 960000) duty = 2870 + (price - 130000) * 0.06;
      else if (price <= 2000000) duty = 28070 + (price - 960000) * 0.055;
      else duty = 110000 + (price - 2000000) * 0.065;
    } else if (state === 'QLD') {
      if (price <= 5000) duty = 0;
      else if (price <= 75000) duty = (price - 5000) * 0.015;
      else if (price <= 540000) duty = 1050 + (price - 75000) * 0.035;
      else if (price <= 1000000) duty = 17325 + (price - 540000) * 0.045;
      else duty = 38025 + (price - 1000000) * 0.0575;
    } else if (state === 'WA') {
      if (price <= 120000) duty = price * 0.019;
      else if (price <= 150000) duty = 2280 + (price - 120000) * 0.0285;
      else if (price <= 360000) duty = 3135 + (price - 150000) * 0.038;
      else if (price <= 725000) duty = 11115 + (price - 360000) * 0.0475;
      else duty = 28453 + (price - 725000) * 0.0515;
    } else if (state === 'SA') {
      if (price <= 12000) duty = price * 0.01;
      else if (price <= 30000) duty = 120 + (price - 12000) * 0.02;
      else if (price <= 50000) duty = 480 + (price - 30000) * 0.03;
      else if (price <= 100000) duty = 1080 + (price - 50000) * 0.035;
      else if (price <= 200000) duty = 2830 + (price - 100000) * 0.04;
      else if (price <= 250000) duty = 6830 + (price - 200000) * 0.0425;
      else if (price <= 300000) duty = 8955 + (price - 250000) * 0.0475;
      else if (price <= 500000) duty = 11330 + (price - 300000) * 0.05;
      else duty = 21330 + (price - 500000) * 0.055;
    } else if (state === 'TAS') {
      if (price <= 3000) duty = 50;
      else if (price <= 25000) duty = 50 + (price - 3000) * 0.0175;
      else if (price <= 75000) duty = 435 + (price - 25000) * 0.025;
      else if (price <= 200000) duty = 1685 + (price - 75000) * 0.035;
      else if (price <= 375000) duty = 6060 + (price - 200000) * 0.04;
      else if (price <= 725000) duty = 13060 + (price - 375000) * 0.0425;
      else duty = 27935 + (price - 725000) * 0.045;
    } else if (state === 'ACT') {
      if (price <= 260000) duty = price * 0.006 * (price / 1000);
      else duty = price * 0.045;
      duty = Math.min(duty, price * 0.055);
    }
    var fhbVal = 0;
    if (firstHomeBuyer === 'yes') {
      if (state === 'NSW' && price <= 800000) fhbVal = duty;
      if (state === 'VIC' && price <= 600000) fhbVal = duty;
      if (state === 'QLD' && price <= 700000) fhbVal = duty;
      if (state === 'WA' && price <= 530000) fhbVal = duty;
      if (state === 'SA' && price <= 650000) fhbVal = duty;
      if (state === 'ACT') fhbVal = duty;
    }
    var foreignSurchargeVal = 0;
    if (foreignBuyer === 'yes') {
      var foreignRates = {NSW: 0.08, VIC: 0.08, QLD: 0.07, WA: 0.07, SA: 0.07, TAS: 0.08, ACT: 0.075};
      foreignSurchargeVal = price * (foreignRates[state] || 0.08);
    }
    var totalDutyVal = Math.max(0, duty - fhbVal) + foreignSurchargeVal;
    var totalCost = price + totalDutyVal;
    document.getElementById('stampDuty').textContent = 'A$' + duty.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('fhbConcession').textContent = fhbVal > 0 ? '-A$' + fhbVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A';
    document.getElementById('foreignSurcharge').textContent = foreignSurchargeVal > 0 ? 'A$' + foreignSurchargeVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A';
    document.getElementById('totalDuty').textContent = 'A$' + totalDutyVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalPurchaseCost').textContent = 'A$' + totalCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['propertyValue', 'state', 'propertyType', 'firstHomeBuyer', 'foreignBuyer'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
