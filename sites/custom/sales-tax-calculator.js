(function() {
  'use strict';

  var stateRates = [
    ['AL', 4.00], ['AK', 0], ['AZ', 5.60], ['AR', 6.50], ['CA', 7.25],
    ['CO', 2.90], ['CT', 6.35], ['DE', 0], ['FL', 6.00], ['GA', 4.00],
    ['HI', 4.00], ['ID', 6.00], ['IL', 6.25], ['IN', 7.00], ['IA', 6.00],
    ['KS', 6.50], ['KY', 6.00], ['LA', 4.45], ['ME', 5.50], ['MD', 6.00],
    ['MA', 6.25], ['MI', 6.00], ['MN', 6.875], ['MS', 7.00], ['MO', 4.225],
    ['MT', 0], ['NE', 5.50], ['NV', 6.85], ['NH', 0], ['NJ', 6.625],
    ['NM', 4.875], ['NY', 4.00], ['NC', 4.75], ['ND', 5.00], ['OH', 5.75],
    ['OK', 4.50], ['OR', 0], ['PA', 6.00], ['RI', 7.00], ['SC', 6.00],
    ['SD', 4.20], ['TN', 7.00], ['TX', 6.25], ['UT', 6.10], ['VT', 6.00],
    ['VA', 5.30], ['WA', 6.50], ['WV', 6.00], ['WI', 5.00], ['WY', 4.00]
  ];

  var mode = 'add';

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Populate state select
  var sel = document.getElementById('stateSelect');
  stateRates.forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s[1];
    opt.textContent = s[0] + ' — ' + s[1] + '%';
    sel.appendChild(opt);
  });

  sel.addEventListener('change', function() {
    if (sel.value) {
      document.getElementById('taxRate').value = sel.value;
    }
  });

  // Mode toggle
  var modeBtns = document.querySelectorAll('#modeToggle button');
  modeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      modeBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      mode = btn.getAttribute('data-mode');

      document.getElementById('priceGroup').style.display = (mode === 'remove') ? 'none' : '';
      document.getElementById('totalPriceGroup').style.display = (mode === 'remove') ? '' : 'none';
      document.getElementById('taxRateGroup').style.display = (mode === 'findrate') ? 'none' : '';
      document.getElementById('taxAmountGroup').style.display = (mode === 'findrate') ? '' : 'none';

      if (mode === 'add') {
        document.getElementById('priceLabel').textContent = 'Price Before Tax ($)';
      } else if (mode === 'findrate') {
        document.getElementById('priceLabel').textContent = 'Price Before Tax ($)';
      }
    });
  });

  function calculate() {
    var preTax, taxAmt, total, rate;

    if (mode === 'add') {
      preTax = parseFloat(document.getElementById('price').value) || 0;
      rate = parseFloat(document.getElementById('taxRate').value) || 0;
      if (preTax <= 0) return;
      taxAmt = preTax * (rate / 100);
      total = preTax + taxAmt;
    } else if (mode === 'remove') {
      total = parseFloat(document.getElementById('totalPrice').value) || 0;
      rate = parseFloat(document.getElementById('taxRate').value) || 0;
      if (total <= 0) return;
      preTax = total / (1 + rate / 100);
      taxAmt = total - preTax;
    } else { // findrate
      preTax = parseFloat(document.getElementById('price').value) || 0;
      taxAmt = parseFloat(document.getElementById('taxAmountInput').value) || 0;
      if (preTax <= 0) return;
      rate = (taxAmt / preTax) * 100;
      total = preTax + taxAmt;
    }

    document.getElementById('preTax').textContent = fmt(preTax);
    document.getElementById('taxAmount').textContent = fmt(taxAmt);
    document.getElementById('totalResult').textContent = fmt(total);
    document.getElementById('rateResult').textContent = rate.toFixed(3) + '%';
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
