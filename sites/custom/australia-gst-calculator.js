(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var direction = document.getElementById('direction').value;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var gstStatus = document.getElementById('gstStatus').value;

    // Calculation logic
    var rate = gstStatus === 'taxable' ? 0.10 : 0;
    var exGSTval, gstVal, incGSTval;
    if (direction === 'add') {
      exGSTval = amount;
      gstVal = amount * rate;
      incGSTval = amount + gstVal;
    } else {
      incGSTval = amount;
      exGSTval = amount / (1 + rate);
      gstVal = incGSTval - exGSTval;
    }
    if (rate === 0) { gstVal = 0; exGSTval = amount; incGSTval = amount; }
    var totalVal = incGSTval * quantity;
    document.getElementById('exGST').textContent = 'A$' + exGSTval.toFixed(2);
    document.getElementById('gstAmount').textContent = 'A$' + gstVal.toFixed(2);
    document.getElementById('incGST').textContent = 'A$' + incGSTval.toFixed(2);
    document.getElementById('totalAll').textContent = 'A$' + totalVal.toFixed(2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'direction', 'quantity', 'gstStatus'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
