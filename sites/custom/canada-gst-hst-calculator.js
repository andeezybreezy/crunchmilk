(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var province = document.getElementById('province').value;
    var direction = document.getElementById('direction').value;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;

    // Calculation logic
    var rates = {AB: {gst: 5, pst: 0, label: 'GST'}, BC: {gst: 5, pst: 7, label: 'GST+PST'}, MB: {gst: 5, pst: 7, label: 'GST+RST'}, NB: {gst: 15, pst: 0, label: 'HST'}, NL: {gst: 15, pst: 0, label: 'HST'}, NS: {gst: 15, pst: 0, label: 'HST'}, NT: {gst: 5, pst: 0, label: 'GST'}, NU: {gst: 5, pst: 0, label: 'GST'}, ON: {gst: 13, pst: 0, label: 'HST'}, PE: {gst: 15, pst: 0, label: 'HST'}, QC: {gst: 5, pst: 9.975, label: 'GST+QST'}, SK: {gst: 5, pst: 6, label: 'GST+PST'}, YT: {gst: 5, pst: 0, label: 'GST'}};
    var r = rates[province];
    var totalRate = (r.gst + r.pst) / 100;
    var sub, gst, pst, total;
    if (direction === 'add') {
      sub = amount;
      gst = amount * r.gst / 100;
      pst = amount * r.pst / 100;
      total = amount * (1 + totalRate);
    } else {
      total = amount;
      sub = amount / (1 + totalRate);
      gst = sub * r.gst / 100;
      pst = sub * r.pst / 100;
    }
    var allTax = gst + pst;
    sub *= quantity; gst *= quantity; pst *= quantity; allTax *= quantity; total *= quantity;
    document.getElementById('subtotal').textContent = '$' + sub.toFixed(2);
    document.getElementById('gstAmount').textContent = '$' + gst.toFixed(2) + ' (' + r.label + ')';
    document.getElementById('pstAmount').textContent = r.pst > 0 ? '$' + pst.toFixed(2) : 'N/A';
    document.getElementById('totalTax').textContent = '$' + allTax.toFixed(2) + ' (' + (r.gst + r.pst).toFixed(2) + '%)';
    document.getElementById('grandTotal').textContent = '$' + total.toFixed(2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'province', 'direction', 'quantity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
