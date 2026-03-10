(function() {
  'use strict';

  // NEC Chapter 9 Table 8 — Circular mils per AWG
  var cmTable = {
    '14': 4110, '12': 6530, '10': 10380, '8': 16510,
    '6': 26240, '4': 41740, '3': 52620, '2': 66360,
    '1': 83690, '1/0': 105600, '2/0': 133100, '3/0': 167800, '4/0': 211600
  };

  // K factors (ohm-CM/ft at 75°C)
  var kFactors = { copper: 12.9, aluminum: 21.2 };

  // DOM refs
  var voltage = document.getElementById('voltage');
  var phase = document.getElementById('phase');
  var conductor = document.getElementById('conductor');
  var wireGauge = document.getElementById('wireGauge');
  var wireLength = document.getElementById('wireLength');
  var loadAmps = document.getElementById('loadAmps');
  var calcBtn = document.getElementById('calcBtn');
  var rVoltageDrop = document.getElementById('rVoltageDrop');
  var rDropPct = document.getElementById('rDropPct');
  var rVoltageAtLoad = document.getElementById('rVoltageAtLoad');
  var rNecStatus = document.getElementById('rNecStatus');
  var resultDetails = document.getElementById('resultDetails');

  function calculate() {
    var V = parseFloat(voltage.value);
    var L = parseFloat(wireLength.value);
    var I = parseFloat(loadAmps.value);

    if (isNaN(L) || isNaN(I) || L <= 0 || I <= 0) {
      rVoltageDrop.textContent = '—';
      rDropPct.textContent = '—';
      rVoltageAtLoad.textContent = '—';
      rNecStatus.textContent = '—';
      resultDetails.innerHTML = '';
      return;
    }

    var K = kFactors[conductor.value];
    var CM = cmTable[wireGauge.value];
    var multiplier = phase.value === 'three' ? 1.732 : 2;

    var vd = (multiplier * K * I * L) / CM;
    var pct = (vd / V) * 100;
    var vAtLoad = V - vd;

    // NEC compliance
    var passBranch = pct <= 3;
    var passTotal = pct <= 5;
    var statusText, statusColor;

    if (passBranch) {
      statusText = 'PASS — Under 3%';
      statusColor = '#16a34a';
    } else if (passTotal) {
      statusText = 'CAUTION — Over 3%';
      statusColor = '#ca8a04';
    } else {
      statusText = 'FAIL — Over 5%';
      statusColor = '#dc2626';
    }

    rVoltageDrop.textContent = vd.toFixed(2) + ' V';
    rDropPct.textContent = pct.toFixed(2) + '%';
    rDropPct.style.color = statusColor;
    rVoltageAtLoad.textContent = vAtLoad.toFixed(1) + ' V';
    rNecStatus.textContent = statusText;
    rNecStatus.style.color = statusColor;

    var phaseLabel = phase.value === 'three' ? 'Three-Phase' : 'Single-Phase';
    var html = '<p style="margin:0 0 8px"><strong>Formula:</strong> VD = (' + multiplier + ' × ' + K + ' × ' + I + ' × ' + L + ') / ' + CM.toLocaleString() + ' = ' + vd.toFixed(2) + 'V</p>';
    html += '<p style="margin:0 0 8px"><strong>Setup:</strong> ' + V + 'V ' + phaseLabel + ', ' + wireGauge.value + ' AWG ' + conductor.value + ', ' + L + ' ft one-way</p>';
    html += '<p style="margin:0 0 8px"><strong>Power loss:</strong> ' + (vd * I).toFixed(1) + ' watts in the wire</p>';

    if (!passBranch) {
      // Suggest next gauge up
      var gauges = ['14','12','10','8','6','4','3','2','1','1/0','2/0','3/0','4/0'];
      var currentIdx = gauges.indexOf(wireGauge.value);
      for (var i = currentIdx + 1; i < gauges.length; i++) {
        var testCM = cmTable[gauges[i]];
        var testVD = (multiplier * K * I * L) / testCM;
        var testPct = (testVD / V) * 100;
        if (testPct <= 3) {
          html += '<p style="margin:0;color:#ca8a04"><strong>Suggestion:</strong> Use ' + gauges[i] + ' AWG for ' + testPct.toFixed(2) + '% drop (under 3%)</p>';
          break;
        }
      }
    }

    resultDetails.innerHTML = html;
  }

  calcBtn.addEventListener('click', calculate);

  [voltage, phase, conductor, wireGauge, wireLength, loadAmps].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

})();
