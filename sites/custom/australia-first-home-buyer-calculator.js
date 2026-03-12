(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    var state = document.getElementById('state').value;
    var propertyType = document.getElementById('propertyType').value;
    var savings = parseFloat(document.getElementById('savings').value) || 0;
    var annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;

    // Calculation logic
    var price = propertyPrice;
    var fhogAmounts = {
      NSW: {amount: 10000, newCap: 600000, estCap: 0},
      VIC: {amount: 10000, newCap: 750000, estCap: 0},
      QLD: {amount: 30000, newCap: 750000, estCap: 0},
      WA: {amount: 10000, newCap: 750000, estCap: 0},
      SA: {amount: 15000, newCap: 650000, estCap: 0},
      TAS: {amount: 30000, newCap: 750000, estCap: 0},
      ACT: {amount: 7500, newCap: 750000, estCap: 0},
      NT: {amount: 10000, newCap: 750000, estCap: 0}
    };
    var f = fhogAmounts[state];
    var fhogVal = 0;
    if (propertyType === 'new') {
      if (price <= f.newCap) fhogVal = f.amount;
    }
    var normalDuty = 0;
    if (state === 'NSW') {
      if (price <= 17000) normalDuty = price * 0.0125;
      else if (price <= 36000) normalDuty = 212 + (price - 17000) * 0.015;
      else if (price <= 97000) normalDuty = 497 + (price - 36000) * 0.0175;
      else if (price <= 364000) normalDuty = 1564 + (price - 97000) * 0.035;
      else if (price <= 1214000) normalDuty = 10909 + (price - 364000) * 0.045;
      else normalDuty = 49159 + (price - 1214000) * 0.055;
    } else if (state === 'VIC') {
      if (price <= 25000) normalDuty = price * 0.014;
      else if (price <= 130000) normalDuty = 350 + (price - 25000) * 0.024;
      else if (price <= 960000) normalDuty = 2870 + (price - 130000) * 0.06;
      else normalDuty = 28070 + (price - 960000) * 0.055;
    } else if (state === 'QLD') {
      if (price <= 5000) normalDuty = 0;
      else if (price <= 75000) normalDuty = (price - 5000) * 0.015;
      else if (price <= 540000) normalDuty = 1050 + (price - 75000) * 0.035;
      else if (price <= 1000000) normalDuty = 17325 + (price - 540000) * 0.045;
      else normalDuty = 38025 + (price - 1000000) * 0.0575;
    } else {
      normalDuty = price * 0.04;
    }
    var stampConcession = 0;
    if (state === 'NSW' && price <= 800000) stampConcession = normalDuty;
    else if (state === 'VIC' && price <= 600000) stampConcession = normalDuty;
    else if (state === 'QLD' && price <= 700000) stampConcession = normalDuty;
    else if (state === 'WA' && price <= 530000) stampConcession = normalDuty;
    else if (state === 'SA' && price <= 650000 && propertyType === 'new') stampConcession = normalDuty;
    else if (state === 'ACT') stampConcession = normalDuty;
    else if (state === 'TAS' && price <= 750000) stampConcession = normalDuty * 0.5;
    else if (state === 'NT') stampConcession = Math.min(normalDuty, 18601);
    var totalSav = fhogVal + stampConcession;
    var effectiveDeposit = ((savings + fhogVal) / price * 100);
    document.getElementById('fhog').textContent = fhogVal > 0 ? 'A$' + fhogVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'Not eligible';
    document.getElementById('stampDutyConcession').textContent = stampConcession > 0 ? 'A$' + stampConcession.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'No concession';
    document.getElementById('normalStampDuty').textContent = 'A$' + normalDuty.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalSavings').textContent = 'A$' + totalSav.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('depositPct').textContent = effectiveDeposit.toFixed(1) + '%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['propertyPrice', 'state', 'propertyType', 'savings', 'annualIncome'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
