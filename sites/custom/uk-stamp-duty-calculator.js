(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    var buyerType = document.getElementById('buyerType').value;
    var isEnglandOrNI = document.getElementById('isEnglandOrNI').value;
    var completionYear = document.getElementById('completionYear').value;

    // Calculation logic
    var price = propertyPrice;
    var sdlt = 0;
    var surcharge = buyerType === 'additional' ? 0.03 : 0;
    if (buyerType === 'ftb' && price <= 625000) {
      if (price <= 425000) { sdlt = 0; }
      else { sdlt = (price - 425000) * 0.05; }
    } else {
      if (price > 250000) { sdlt += Math.min(price, 925000) > 250000 ? (Math.min(price, 925000) - 250000) * 0.05 : 0; }
      if (price > 925000) { sdlt += (Math.min(price, 1500000) - 925000) * 0.10; }
      if (price > 1500000) { sdlt += (price - 1500000) * 0.12; }
    }
    sdlt += price * surcharge;
    var effRate = price > 0 ? (sdlt / price * 100) : 0;
    var totalCost = price + sdlt;
    var breakdown = '';
    if (buyerType === 'ftb' && price <= 625000) {
      breakdown = '0% on first \u00A3425k, 5% on \u00A3425k-\u00A3625k';
    } else {
      breakdown = '0% up to \u00A3250k, 5% \u00A3250k-\u00A3925k, 10% \u00A3925k-\u00A31.5m, 12% above \u00A31.5m';
    }
    if (surcharge > 0) breakdown += ' + 3% surcharge';
    document.getElementById('totalSDLT').textContent = '\u00A3' + sdlt.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('effectiveRate').textContent = effRate.toFixed(2) + '%';
    document.getElementById('totalCost').textContent = '\u00A3' + totalCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('bandBreakdown').textContent = breakdown;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['propertyPrice', 'buyerType', 'isEnglandOrNI', 'completionYear'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
