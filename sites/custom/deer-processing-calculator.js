(function() {
  'use strict';

  var cuts = [
    { name: 'Ground Venison', pct: 0.40 },
    { name: 'Steaks (loin, backstrap)', pct: 0.25 },
    { name: 'Roasts (shoulder, rump)', pct: 0.20 },
    { name: 'Stew Meat', pct: 0.10 },
    { name: 'Miscellaneous (ribs, shanks, trim)', pct: 0.05 }
  ];

  function calculate() {
    var type = document.getElementById('animalType').value;
    var weightType = document.getElementById('weightType').value;
    var weight = parseFloat(document.getElementById('animalWeight').value);

    if (isNaN(weight) || weight <= 0) return;

    // Yield percentages
    var fieldDressedPct = 0.78;
    var hangingPct = 0.75; // of field dressed
    var bonelessPct = 0.57; // of hanging weight

    // Adjust slightly by animal type
    if (type === 'elk') {
      bonelessPct = 0.58;
    } else if (type === 'mule') {
      bonelessPct = 0.56;
    }

    var liveWt, fieldDressedWt;
    if (weightType === 'live') {
      liveWt = weight;
      fieldDressedWt = weight * fieldDressedPct;
    } else {
      fieldDressedWt = weight;
      liveWt = weight / fieldDressedPct;
    }

    var hangingWt = fieldDressedWt * hangingPct;
    var bonelessWt = hangingWt * bonelessPct;
    var freezerCuFt = bonelessWt / 32;

    document.getElementById('fieldDressed').textContent = Math.round(fieldDressedWt) + ' lbs';
    document.getElementById('hangingWt').textContent = Math.round(hangingWt) + ' lbs';
    document.getElementById('bonelessYield').textContent = Math.round(bonelessWt) + ' lbs';
    document.getElementById('freezerSpace').textContent = freezerCuFt.toFixed(1) + ' cu ft';

    var tbody = document.getElementById('cutBody');
    tbody.innerHTML = '';
    for (var i = 0; i < cuts.length; i++) {
      var c = cuts[i];
      var lbs = bonelessWt * c.pct;
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + c.name + '</td>' +
        '<td>' + Math.round(c.pct * 100) + '%</td>' +
        '<td>' + lbs.toFixed(1) + '</td>';
      tbody.appendChild(tr);
    }

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  document.getElementById('animalWeight').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });
})();
