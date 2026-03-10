(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var groundTempEl = document.getElementById('groundTemp');
  var targetTempEl = document.getElementById('targetTemp');
  var fuelTypeEl = document.getElementById('fuelType');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['40°F (North)', '80°F', '3.6 GPM', '4.8 GPM', '1 shower + 1 faucet'],
    ['50°F (Mid)', '70°F', '4.1 GPM', '5.5 GPM', '2 showers'],
    ['57°F (South)', '63°F', '4.6 GPM', '6.1 GPM', '2 showers + faucet'],
    ['62°F (Deep S)', '58°F', '5.0 GPM', '6.6 GPM', '2 showers + faucet'],
    ['70°F (Hawaii)', '50°F', '5.8 GPM', '7.7 GPM', '3 showers']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var groundTemp = getVal(groundTempEl);
    var targetTemp = getVal(targetTempEl);
    var fuelType = fuelTypeEl.value;

    if (targetTemp <= groundTemp) return;

    // Sum all checked fixtures
    var checkboxes = document.querySelectorAll('.fixture');
    var totalGPM = 0;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        totalGPM += parseFloat(checkboxes[i].value);
      }
    }

    if (totalGPM <= 0) return;

    var tempRise = targetTemp - groundTemp;

    // BTU formula: GPM × tempRise × 8.33 (lbs/gal) × 60 (min/hr)
    // Divide by efficiency: gas ~0.80-0.97, electric ~0.99
    var efficiency = fuelType === 'gas' ? 0.85 : 0.99;
    var btuRequired = totalGPM * tempRise * 8.33 * 60 / efficiency;

    var recommended = '';
    var gasLineSize = '';
    var electricReq = '';

    if (fuelType === 'gas') {
      if (btuRequired <= 120000) recommended = '120,000 BTU (small)';
      else if (btuRequired <= 150000) recommended = '150,000 BTU (medium)';
      else if (btuRequired <= 180000) recommended = '180,000 BTU (large)';
      else if (btuRequired <= 199000) recommended = '199,000 BTU (XL)';
      else recommended = '199,000+ BTU or 2 units';

      gasLineSize = btuRequired > 150000 ? '1" recommended' : '3/4" minimum';
      electricReq = 'N/A (gas)';
    } else {
      var kwNeeded = btuRequired / 3412; // 1 kW = 3412 BTU
      if (kwNeeded <= 18) recommended = '18 kW';
      else if (kwNeeded <= 24) recommended = '24 kW';
      else if (kwNeeded <= 27) recommended = '27 kW';
      else if (kwNeeded <= 36) recommended = '36 kW';
      else recommended = '36+ kW (may need 2 units)';

      gasLineSize = 'N/A (electric)';
      var amps = Math.ceil(kwNeeded * 1000 / 240);
      var circuits = Math.ceil(amps / 40);
      electricReq = fmt(kwNeeded, 0) + ' kW / ' + circuits + ' × 40A circuits';
    }

    document.getElementById('rGPM').textContent = fmt(totalGPM, 1) + ' GPM';
    document.getElementById('rTempRise').textContent = fmt(tempRise, 0) + '°F';
    document.getElementById('rBTU').textContent = fmt(btuRequired, 0) + ' BTU/hr';
    document.getElementById('rSize').textContent = recommended;
    document.getElementById('rGasLine').textContent = gasLineSize;
    document.getElementById('rElectric').textContent = electricReq;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Listen on checkboxes too
  var checkboxes = document.querySelectorAll('.fixture');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', calculate);
  }

  [groundTempEl, targetTempEl, fuelTypeEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
