(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function calculate() {
    var gcwr = val('gcwr');
    var gvwr = val('gvwr');
    var maxTow = val('maxTow');
    var maxPayload = val('maxPayload');
    var curbWeight = val('curbWeight');
    var cargoWeight = val('cargoWeight');
    var trailerWeight = val('trailerWeight');
    var tongueWeight = val('tongueWeight');

    if (gcwr <= 0 || maxTow <= 0) return;

    var vehicleLoaded = curbWeight + cargoWeight;
    var combinedWeight = vehicleLoaded + trailerWeight;

    // Tow rating check
    var towRemaining = maxTow - trailerWeight;

    // GCWR check
    var gcwrRemaining = gcwr - combinedWeight;

    // Payload check: tongue weight counts against payload
    var usedPayload = cargoWeight + tongueWeight;
    var payloadRemaining = maxPayload - usedPayload;

    // Tongue weight percentage
    var tonguePct = trailerWeight > 0 ? (tongueWeight / trailerWeight) * 100 : 0;

    // Status
    var issues = [];
    if (towRemaining < 0) issues.push('OVER tow rating');
    if (gcwrRemaining < 0) issues.push('OVER GCWR');
    if (payloadRemaining < 0) issues.push('OVER payload');
    if (tonguePct < 9) issues.push('Tongue weight too low');
    if (tonguePct > 15) issues.push('Tongue weight high');

    var statusText = issues.length === 0 ? 'ALL CLEAR' : issues.join(' · ');
    var statusColor = issues.length === 0 ? '#059669' : '#dc2626';

    document.getElementById('towRemain').textContent = towRemaining.toLocaleString() + ' lbs';
    document.getElementById('towRemain').style.color = towRemaining >= 0 ? '' : '#dc2626';

    document.getElementById('gcwrRemain').textContent = gcwrRemaining.toLocaleString() + ' lbs';
    document.getElementById('gcwrRemain').style.color = gcwrRemaining >= 0 ? '' : '#dc2626';

    document.getElementById('payloadRemain').textContent = payloadRemaining.toLocaleString() + ' lbs';
    document.getElementById('payloadRemain').style.color = payloadRemaining >= 0 ? '' : '#dc2626';

    document.getElementById('tonguePct').textContent = tonguePct.toFixed(1) + '%';
    document.getElementById('tonguePct').style.color = (tonguePct >= 9 && tonguePct <= 15) ? '' : '#dc2626';

    document.getElementById('combinedWeight').textContent = combinedWeight.toLocaleString() + ' lbs';

    var statusEl = document.getElementById('status');
    statusEl.textContent = statusText;
    statusEl.style.color = statusColor;

    var tip = 'Vehicle loaded: ' + vehicleLoaded.toLocaleString() + ' lbs · ' +
      'Payload used: ' + usedPayload.toLocaleString() + ' of ' + maxPayload.toLocaleString() + ' lbs';
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var rows = [
      ['Compact SUV', '2,000–3,500', '900–1,200', '8,000–10,000'],
      ['Midsize Truck', '3,500–7,700', '1,200–1,800', '12,000–14,000'],
      ['Half-Ton Truck', '6,000–14,000', '1,500–2,300', '15,000–20,000'],
      ['3/4-Ton Truck', '12,000–22,000', '2,500–4,000', '22,000–28,000'],
      ['1-Ton Truck', '18,000–37,000', '4,000–7,600', '33,000–43,000'],
      ['Full-Size SUV', '6,000–8,700', '1,400–1,800', '14,000–17,000']
    ];
    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      r.forEach(function(c) {
        var td = document.createElement('td');
        td.textContent = c;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
