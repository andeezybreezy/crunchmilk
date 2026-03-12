(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var band = document.getElementById('band').value;
    var region = document.getElementById('region').value;
    var singleOccupant = document.getElementById('singleOccupant').value;
    var paymentMonths = document.getElementById('paymentMonths').value;

    // Calculation logic
    var bandD = {average: 2171, london: 1898, southeast: 2152, northwest: 2191, northeast: 2190, midlands: 2175, southwest: 2290, yorkshire: 2108};
    var ratios = {A: 6/9, B: 7/9, C: 8/9, D: 1, E: 11/9, F: 13/9, G: 15/9, H: 2};
    var baseBandD = bandD[region] || 2171;
    var ratio = ratios[band] || 1;
    var annual = baseBandD * ratio;
    if (singleOccupant === 'yes') annual *= 0.75;
    var monthly = annual / parseFloat(paymentMonths);
    var weekly = annual / 52;
    document.getElementById('annualBill').textContent = '\u00A3' + annual.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('monthlyPayment').textContent = '\u00A3' + monthly.toFixed(2);
    document.getElementById('weeklyEquiv').textContent = '\u00A3' + weekly.toFixed(2);
    document.getElementById('bandRatio').textContent = ratio.toFixed(4) + ' (Band ' + band + ' vs Band D)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['band', 'region', 'singleOccupant', 'paymentMonths'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
