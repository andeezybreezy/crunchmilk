(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function calculate() {
    var greenCN = parseFloat(document.getElementById('greenType').value);
    var greenVol = val('greenVol');
    var brownCN = parseFloat(document.getElementById('brownType').value);
    var brownVol = val('brownVol');
    var targetCN = val('targetCN');

    if ((greenVol + brownVol) <= 0) return;

    var totalVol = greenVol + brownVol;

    // Weighted average C:N ratio
    var currentCN = (greenVol * greenCN + brownVol * brownCN) / totalVol;

    // Status
    var status;
    var statusColor;
    if (currentCN >= 25 && currentCN <= 35) {
      status = 'Ideal range';
      statusColor = '#059669';
    } else if (currentCN < 25) {
      status = 'Too much nitrogen';
      statusColor = '#dc2626';
    } else {
      status = 'Too much carbon';
      statusColor = '#ea580c';
    }

    // Calculate adjustment needed
    var adjustment;
    if (currentCN >= 25 && currentCN <= 35) {
      adjustment = 'No adjustment needed';
    } else if (currentCN < targetCN) {
      // Need more browns: solve (greenVol*greenCN + (brownVol+x)*brownCN) / (totalVol+x) = targetCN
      var xBrown = (greenVol * (targetCN - greenCN) - brownVol * (brownCN - targetCN)) / (brownCN - targetCN);
      if (xBrown > 0) {
        adjustment = 'Add ~' + Math.ceil(xBrown) + ' gal of browns';
      } else {
        adjustment = 'Reduce greens or add browns';
      }
    } else {
      // Need more greens
      var xGreen = (brownVol * (brownCN - targetCN) - greenVol * (targetCN - greenCN)) / (targetCN - greenCN);
      if (xGreen > 0) {
        adjustment = 'Add ~' + Math.ceil(xGreen) + ' gal of greens';
      } else {
        adjustment = 'Reduce browns or add greens';
      }
    }

    // Green:Brown volume ratio
    var gbRatio;
    if (brownVol > 0 && greenVol > 0) {
      gbRatio = '1:' + (brownVol / greenVol).toFixed(1);
    } else if (greenVol === 0) {
      gbRatio = '0:1 (all brown)';
    } else {
      gbRatio = '1:0 (all green)';
    }

    document.getElementById('currentCN').textContent = currentCN.toFixed(1) + ':1';
    var statusEl = document.getElementById('status');
    statusEl.textContent = status;
    statusEl.style.color = statusColor;
    document.getElementById('totalVol').textContent = totalVol + ' gallons (' + (totalVol / 7.48).toFixed(1) + ' cu ft)';
    document.getElementById('gbRatio').textContent = gbRatio;
    document.getElementById('adjustment').textContent = adjustment;

    document.getElementById('resultTip').textContent =
      'Target: ' + targetCN + ':1 · Current: ' + currentCN.toFixed(1) + ':1';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  document.getElementById('greenType').addEventListener('change', calculate);
  document.getElementById('brownType').addEventListener('change', calculate);

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var materials = [
      ['Coffee grounds', 'Green', '7:1', 'Excellent nitrogen source'],
      ['Fresh manure', 'Green', '12:1', 'Chicken highest, horse lower'],
      ['Food scraps', 'Green', '15:1', 'Fruit/veggie scraps'],
      ['Grass clippings', 'Green', '20:1', 'Fresh, not dried'],
      ['Dry leaves', 'Brown', '60:1', 'Shred for faster breakdown'],
      ['Straw', 'Brown', '80:1', 'Not hay (hay has seeds)'],
      ['Wood chips', 'Brown', '100:1', 'Best for paths/mulch'],
      ['Cardboard', 'Brown', '400:1', 'Shred; remove tape/plastic'],
      ['Sawdust', 'Brown', '500:1', 'Use sparingly; compacts']
    ];
    materials.forEach(function(r) {
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
