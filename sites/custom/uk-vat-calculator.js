(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var vatRate = document.getElementById('vatRate').value;
    var direction = document.getElementById('direction').value;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;

    // Calculation logic
    var rate = parseFloat(vatRate) / 100;
    var net, vat, gross;
    if (direction === 'add') {
      net = amount;
      vat = amount * rate;
      gross = amount + vat;
    } else {
      gross = amount;
      net = amount / (1 + rate);
      vat = gross - net;
    }
    var total = gross * quantity;
    document.getElementById('netAmount').textContent = '\u00A3' + net.toFixed(2);
    document.getElementById('vatAmount').textContent = '\u00A3' + vat.toFixed(2);
    document.getElementById('grossAmount').textContent = '\u00A3' + gross.toFixed(2);
    document.getElementById('totalWithQty').textContent = '\u00A3' + total.toFixed(2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'vatRate', 'direction', 'quantity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
