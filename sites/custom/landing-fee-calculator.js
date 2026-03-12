(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var aircraftWeight = parseFloat(document.getElementById('aircraftWeight').value) || 0;
    var airportType = document.getElementById('airportType').value;
    var fboType = document.getElementById('fboType').value;
    var overnightStay = parseFloat(document.getElementById('overnightStay').value) || 0;
    var fuelPurchase = parseFloat(document.getElementById('fuelPurchase').value) || 0;
    var hangarRequest = document.getElementById('hangarRequest').value;

    // Calculation logic
    var landingRates = {untowered:0,towered:0,regional:0.003,major:0.005,international:0.008}; var landFee = aircraftWeight * (landingRates[airportType] || 0); if(airportType === 'untowered') landFee = 0; else if(airportType === 'towered') landFee = aircraftWeight > 12500 ? aircraftWeight * 0.002 : 0; var rampFees = {none:0,standard:{base:25,heavy:75},premium:{base:75,heavy:250}}; var rampFee = 0; if(fboType !== 'none') { rampFee = aircraftWeight > 12500 ? rampFees[fboType].heavy : rampFees[fboType].base; } var parkRate = 0; if(overnightStay > 0) { if(hangarRequest === 'yes') { parkRate = aircraftWeight > 12500 ? 150 : 50; if(fboType === 'premium') parkRate *= 2; } else { parkRate = aircraftWeight > 12500 ? 50 : 15; if(fboType === 'premium') parkRate *= 1.5; } } var parkTotal = parkRate * overnightStay; var fuelWaiverMin = {none:0,standard:20,premium:40}; var minGal = fuelWaiverMin[fboType] || 0; var waived = fuelPurchase >= minGal && minGal > 0 ? rampFee : 0; var total = landFee + rampFee + parkTotal; var net = total - waived; document.getElementById('landingFee').textContent = landFee > 0 ? dollar(landFee) : 'No landing fee'; document.getElementById('rampFee').textContent = rampFee > 0 ? dollar(rampFee) : 'No ramp fee'; document.getElementById('parkingFee').textContent = overnightStay > 0 ? dollar(parkTotal) + ' (' + overnightStay + ' night' + (overnightStay > 1 ? 's' : '') + ')' : 'N/A'; document.getElementById('fuelWaiver').textContent = waived > 0 ? dollar(waived) + ' waived (bought ' + fmt(fuelPurchase, 0) + ' gal)' : minGal > 0 ? 'Buy ' + minGal + '+ gal to waive ramp fee' : 'N/A'; document.getElementById('totalFees').textContent = dollar(total); document.getElementById('netCost').textContent = dollar(net);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['aircraftWeight', 'airportType', 'fboType', 'overnightStay', 'fuelPurchase', 'hangarRequest'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
