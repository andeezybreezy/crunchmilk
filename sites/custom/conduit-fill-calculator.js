(function() {
  'use strict';

  // NEC Chapter 9 Table 5 — THHN wire areas (sq in) including insulation
  var wireAreas = {
    '14': 0.0097, '12': 0.0133, '10': 0.0211, '8': 0.0366,
    '6': 0.0507, '4': 0.0824, '3': 0.0973, '2': 0.1158,
    '1': 0.1562, '1/0': 0.1855, '2/0': 0.2223, '3/0': 0.2679, '4/0': 0.3237
  };

  // Conduit internal areas (sq in) by type and trade size
  var conduitAreas = {
    EMT: {
      '0.5': 0.304, '0.75': 0.533, '1': 0.864, '1.25': 1.496,
      '1.5': 2.036, '2': 3.356, '2.5': 4.881, '3': 7.499,
      '3.5': 9.521, '4': 12.723
    },
    PVC40: {
      '0.5': 0.285, '0.75': 0.508, '1': 0.832, '1.25': 1.453,
      '1.5': 1.986, '2': 3.291, '2.5': 4.695, '3': 7.268,
      '3.5': 9.737, '4': 12.554
    },
    PVC80: {
      '0.5': 0.217, '0.75': 0.409, '1': 0.688, '1.25': 1.237,
      '1.5': 1.711, '2': 2.874, '2.5': 4.119, '3': 6.442,
      '3.5': 8.688, '4': 11.258
    },
    RMC: {
      '0.5': 0.314, '0.75': 0.549, '1': 0.887, '1.25': 1.526,
      '1.5': 2.071, '2': 3.408, '2.5': 4.866, '3': 7.499,
      '3.5': 9.521, '4': 12.566
    }
  };

  // NEC Chapter 9 Table 1 fill percentages
  function getAllowedFillPct(numWires) {
    if (numWires === 1) return 53;
    if (numWires === 2) return 31;
    return 40;
  }

  var conduitSizes = ['0.5','0.75','1','1.25','1.5','2','2.5','3','3.5','4'];
  var conduitLabels = { '0.5':'1/2"','0.75':'3/4"','1':'1"','1.25':'1-1/4"','1.5':'1-1/2"','2':'2"','2.5':'2-1/2"','3':'3"','3.5':'3-1/2"','4':'4"' };

  var conduitType = document.getElementById('conduitType');
  var conduitSize = document.getElementById('conduitSize');
  var wireGauge = document.getElementById('wireGauge');
  var numWires = document.getElementById('numWires');
  var calcBtn = document.getElementById('calcBtn');
  var rFillPct = document.getElementById('rFillPct');
  var rStatus = document.getElementById('rStatus');
  var rMaxWires = document.getElementById('rMaxWires');
  var rSuggested = document.getElementById('rSuggested');
  var resultDetails = document.getElementById('resultDetails');

  function calculate() {
    var n = parseInt(numWires.value, 10);
    if (isNaN(n) || n < 1) {
      rFillPct.textContent = '—';
      rStatus.textContent = '—';
      rMaxWires.textContent = '—';
      rSuggested.textContent = '—';
      resultDetails.innerHTML = '';
      return;
    }

    var type = conduitType.value;
    var size = conduitSize.value;
    var gauge = wireGauge.value;

    var condArea = conduitAreas[type][size];
    var wireArea = wireAreas[gauge];
    var totalWireArea = wireArea * n;
    var fillPct = (totalWireArea / condArea) * 100;
    var allowedPct = getAllowedFillPct(n);
    var pass = fillPct <= allowedPct;

    // Max wires in this conduit (at 40% for 3+)
    var maxN = Math.floor((condArea * 0.40) / wireArea);
    if (maxN < 1) maxN = 1;

    rFillPct.textContent = fillPct.toFixed(1) + '%';
    rFillPct.style.color = pass ? '#16a34a' : '#dc2626';
    rMaxWires.textContent = maxN + ' wires';

    if (pass) {
      rStatus.textContent = 'PASS';
      rStatus.style.color = '#16a34a';
      rSuggested.textContent = conduitLabels[size] + ' ' + type;
      rSuggested.style.color = '';
    } else {
      rStatus.textContent = 'FAIL — Over ' + allowedPct + '%';
      rStatus.style.color = '#dc2626';

      // Find next size up
      var sizeIdx = conduitSizes.indexOf(size);
      var suggested = null;
      for (var i = sizeIdx + 1; i < conduitSizes.length; i++) {
        var testArea = conduitAreas[type][conduitSizes[i]];
        var testFill = (totalWireArea / testArea) * 100;
        if (testFill <= getAllowedFillPct(n)) {
          suggested = conduitSizes[i];
          break;
        }
      }

      if (suggested) {
        rSuggested.textContent = conduitLabels[suggested] + ' ' + type;
        rSuggested.style.color = '#ca8a04';
      } else {
        rSuggested.textContent = 'Split into multiple conduits';
        rSuggested.style.color = '#dc2626';
      }
    }

    var html = '<p style="margin:0 0 8px"><strong>Wire area:</strong> ' + n + ' × ' + wireArea + ' sq in = ' + totalWireArea.toFixed(4) + ' sq in</p>';
    html += '<p style="margin:0 0 8px"><strong>Conduit area:</strong> ' + condArea.toFixed(3) + ' sq in (' + conduitLabels[size] + ' ' + type + ')</p>';
    html += '<p style="margin:0 0 8px"><strong>Allowed fill:</strong> ' + allowedPct + '% = ' + (condArea * allowedPct / 100).toFixed(4) + ' sq in</p>';
    html += '<p style="margin:0"><strong>Remaining capacity:</strong> ' + ((condArea * allowedPct / 100) - totalWireArea).toFixed(4) + ' sq in</p>';

    resultDetails.innerHTML = html;
  }

  calcBtn.addEventListener('click', calculate);

  [conduitType, conduitSize, wireGauge, numWires].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

})();
