(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var format = document.getElementById('format').value;
    var color = document.getElementById('color').value;
    var jacket = document.getElementById('jacket').value;

    // Calculation logic
    var baseCosts = {'7single':2.50,'12lp':5.00,'12double':8.00,'10ep':4.00};
    var base = baseCosts[format];
    var colorAdd = color === 'black' ? 0 : (color === 'color' ? 0.50 : 1.50);
    var jacketAdd = jacket === 'generic' ? 0 : (jacket === 'printed' ? 1.50 : 3.00);
    var qtyDiscount = quantity >= 1000 ? 0.85 : (quantity >= 500 ? 0.92 : 1.0);
    var setupFee = 350;
    var perUnit = (base + colorAdd + jacketAdd) * qtyDiscount;
    var total = (perUnit * quantity) + setupFee;
    var actualPerUnit = total / quantity;
    var retails = {'7single':9.99,'12lp':24.99,'12double':34.99,'10ep':17.99};
    var retail = retails[format];
    var totalRevenue = retail * quantity;
    var profit = totalRevenue - total;
    document.getElementById('perUnit').textContent = dollar(actualPerUnit) + ' (incl. setup fee)';
    document.getElementById('totalCost').textContent = dollar(total);
    document.getElementById('suggestedRetail').textContent = dollar(retail) + ' each';
    document.getElementById('profit').textContent = dollar(profit) + ' on ' + fmt(quantity, 0) + ' units';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['quantity', 'format', 'color', 'jacket'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
