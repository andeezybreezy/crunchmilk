(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var nights = parseFloat(document.getElementById('nights').value) || 0;
    var hotelRate = parseFloat(document.getElementById('hotelRate').value) || 0;
    var hotelTaxPct = parseFloat(document.getElementById('hotelTaxPct').value) || 0;
    var airbnbRate = parseFloat(document.getElementById('airbnbRate').value) || 0;
    var airbnbClean = parseFloat(document.getElementById('airbnbClean').value) || 0;
    var airbnbService = parseFloat(document.getElementById('airbnbService').value) || 0;

    // Calculation logic
    var hotelSubtotal = hotelRate * nights;
    var hotelTax = hotelSubtotal * (hotelTaxPct / 100);
    var hotelTotal = hotelSubtotal + hotelTax;
    var airbnbSubtotal = airbnbRate * nights;
    var airbnbServiceFee = airbnbSubtotal * (airbnbService / 100);
    var airbnbTotal = airbnbSubtotal + airbnbClean + airbnbServiceFee;
    var diff = Math.abs(hotelTotal - airbnbTotal);
    var winner = hotelTotal < airbnbTotal ? 'Hotel' : 'Airbnb';
    document.getElementById('hotelTotal').textContent = dollar(hotelTotal) + ' (' + dollar(hotelTotal / nights) + '/night effective)';
    document.getElementById('airbnbTotal').textContent = dollar(airbnbTotal) + ' (' + dollar(airbnbTotal / nights) + '/night effective)';
    document.getElementById('savings').textContent = winner + ' saves ' + dollar(diff) + ' (' + dollar(diff / nights) + '/night)';
    document.getElementById('perNight').textContent = 'Hotel: ' + dollar(hotelTotal / nights) + ' vs Airbnb: ' + dollar(airbnbTotal / nights);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['nights', 'hotelRate', 'hotelTaxPct', 'airbnbRate', 'airbnbClean', 'airbnbService'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
