(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    var province = document.getElementById('province').value;
    var firstTimeBuyer = document.getElementById('firstTimeBuyer').value;
    var toronto = document.getElementById('toronto').value;
    var foreignBuyer = document.getElementById('foreignBuyer').value;

    // Calculation logic
    var price = purchasePrice;
    var provLTT = 0;
    if (province === 'ON') {
      if (price > 55000) provLTT += (Math.min(price, 250000) - 55000) * 0.01;
      if (price > 250000) provLTT += (Math.min(price, 400000) - 250000) * 0.015;
      if (price > 400000) provLTT += (Math.min(price, 2000000) - 400000) * 0.02;
      if (price > 2000000) provLTT += (price - 2000000) * 0.025;
      provLTT += Math.min(price, 55000) * 0.005;
    } else if (province === 'BC') {
      if (price <= 200000) provLTT = price * 0.01;
      else if (price <= 2000000) provLTT = 200000 * 0.01 + (Math.min(price, 2000000) - 200000) * 0.02;
      else provLTT = 200000 * 0.01 + 1800000 * 0.02 + (Math.min(price, 3000000) - 2000000) * 0.03;
      if (price > 3000000) provLTT += (price - 3000000) * 0.05;
    } else if (province === 'QC') {
      provLTT = Math.min(price, 55200) * 0.005;
      if (price > 55200) provLTT += (Math.min(price, 276200) - 55200) * 0.01;
      if (price > 276200) provLTT += (Math.min(price, 552300) - 276200) * 0.015;
      if (price > 552300) provLTT += (price - 552300) * 0.02;
    } else if (province === 'MB') {
      if (price > 30000) provLTT = (Math.min(price, 90000) - 30000) * 0.005;
      if (price > 90000) provLTT += (Math.min(price, 150000) - 90000) * 0.01;
      if (price > 150000) provLTT += (Math.min(price, 200000) - 150000) * 0.015;
      if (price > 200000) provLTT += (price - 200000) * 0.02;
    } else if (province === 'NS') {
      provLTT = price * 0.015 + 78.5;
    } else if (province === 'NB') {
      provLTT = price * 0.01;
    } else if (province === 'PE') {
      provLTT = price * 0.01;
    }
    var munLTT = 0;
    if (toronto === 'yes' && province === 'ON') {
      munLTT += Math.min(price, 55000) * 0.005;
      if (price > 55000) munLTT += (Math.min(price, 250000) - 55000) * 0.01;
      if (price > 250000) munLTT += (Math.min(price, 400000) - 250000) * 0.015;
      if (price > 400000) munLTT += (Math.min(price, 2000000) - 400000) * 0.02;
      if (price > 2000000) munLTT += (price - 2000000) * 0.025;
    }
    var ftbRebateVal = 0;
    if (firstTimeBuyer === 'yes') {
      if (province === 'ON') ftbRebateVal = Math.min(provLTT, 4000);
      if (province === 'BC' && price <= 835000) ftbRebateVal = provLTT;
      if (toronto === 'yes') ftbRebateVal += Math.min(munLTT, 4475);
    }
    var foreignTaxVal = 0;
    if (foreignBuyer === 'yes') {
      if (province === 'ON') foreignTaxVal = price * 0.25;
      if (province === 'BC') foreignTaxVal = price * 0.20;
    }
    var totalVal = provLTT + munLTT - ftbRebateVal + foreignTaxVal;
    var closingCosts = totalVal + price * 0.015;
    document.getElementById('provincialLTT').textContent = '$' + provLTT.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('municipalLTT').textContent = toronto === 'yes' ? '$' + munLTT.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A';
    document.getElementById('ftbRebate').textContent = ftbRebateVal > 0 ? '-$' + ftbRebateVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A';
    document.getElementById('foreignTax').textContent = foreignTaxVal > 0 ? '$' + foreignTaxVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A';
    document.getElementById('totalLTT').textContent = '$' + totalVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalClosing').textContent = '$' + closingCosts.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['purchasePrice', 'province', 'firstTimeBuyer', 'toronto', 'foreignBuyer'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
