(function() {
  'use strict';

  // Wire data: [gauge label, circular mils, copper ampacity 75°C, aluminum ampacity 75°C, conduit size for 3 THHN]
  var wireData = [
    { gauge: '14', cm: 4110,   cuAmp: 15,  alAmp: 0,   conduit: '1/2"' },
    { gauge: '12', cm: 6530,   cuAmp: 20,  alAmp: 15,  conduit: '1/2"' },
    { gauge: '10', cm: 10380,  cuAmp: 30,  alAmp: 25,  conduit: '1/2"' },
    { gauge: '8',  cm: 16510,  cuAmp: 40,  alAmp: 30,  conduit: '1/2"' },
    { gauge: '6',  cm: 26240,  cuAmp: 55,  alAmp: 40,  conduit: '3/4"' },
    { gauge: '4',  cm: 41740,  cuAmp: 70,  alAmp: 55,  conduit: '1"' },
    { gauge: '3',  cm: 52620,  cuAmp: 85,  alAmp: 65,  conduit: '1"' },
    { gauge: '2',  cm: 66360,  cuAmp: 95,  alAmp: 75,  conduit: '1"' },
    { gauge: '1',  cm: 83690,  cuAmp: 110, alAmp: 85,  conduit: '1-1/4"' },
    { gauge: '1/0', cm: 105600, cuAmp: 125, alAmp: 100, conduit: '1-1/4"' },
    { gauge: '2/0', cm: 133100, cuAmp: 145, alAmp: 115, conduit: '1-1/2"' },
    { gauge: '3/0', cm: 167800, cuAmp: 165, alAmp: 130, conduit: '1-1/2"' },
    { gauge: '4/0', cm: 211600, cuAmp: 195, alAmp: 150, conduit: '2"' }
  ];

  var kFactors = { copper: 12.9, aluminum: 21.2 };

  var voltage = document.getElementById('voltage');
  var phase = document.getElementById('phase');
  var amperage = document.getElementById('amperage');
  var distance = document.getElementById('distance');
  var conductor = document.getElementById('conductor');
  var maxDrop = document.getElementById('maxDrop');
  var calcBtn = document.getElementById('calcBtn');
  var rWire = document.getElementById('rWire');
  var rAmpacity = document.getElementById('rAmpacity');
  var rActualDrop = document.getElementById('rActualDrop');
  var rConduit = document.getElementById('rConduit');
  var resultDetails = document.getElementById('resultDetails');

  function calculate() {
    var V = parseFloat(voltage.value);
    var I = parseFloat(amperage.value);
    var L = parseFloat(distance.value);
    var maxPct = parseFloat(maxDrop.value);

    if (isNaN(I) || isNaN(L) || I <= 0 || L <= 0) {
      rWire.textContent = '—';
      rAmpacity.textContent = '—';
      rActualDrop.textContent = '—';
      rConduit.textContent = '—';
      resultDetails.innerHTML = '';
      return;
    }

    var K = kFactors[conductor.value];
    var isCu = conductor.value === 'copper';
    var multiplier = phase.value === 'three' ? 1.732 : 2;
    var maxVD = V * (maxPct / 100);

    // Minimum CM needed for voltage drop
    var cmNeeded = (multiplier * K * I * L) / maxVD;

    // Find smallest wire that satisfies BOTH ampacity and voltage drop
    var ampKey = isCu ? 'cuAmp' : 'alAmp';
    var bestIdx = -1;

    for (var i = 0; i < wireData.length; i++) {
      var w = wireData[i];
      if (w[ampKey] >= I && w.cm >= cmNeeded) {
        bestIdx = i;
        break;
      }
    }

    // Check ampacity-only minimum
    var ampIdx = -1;
    for (var j = 0; j < wireData.length; j++) {
      if (wireData[j][ampKey] >= I) { ampIdx = j; break; }
    }

    // Check voltage-drop-only minimum
    var vdIdx = -1;
    for (var m = 0; m < wireData.length; m++) {
      if (wireData[m].cm >= cmNeeded) { vdIdx = m; break; }
    }

    if (bestIdx === -1) {
      rWire.textContent = '> 4/0 AWG';
      rWire.style.color = '#dc2626';
      rAmpacity.textContent = '—';
      rActualDrop.textContent = '—';
      rConduit.textContent = '—';
      resultDetails.innerHTML = '<p style="color:#dc2626;margin:0"><strong>Load exceeds 4/0 AWG capacity.</strong> Consider parallel runs, higher voltage, or shorter distance.</p>';
      return;
    }

    var best = wireData[bestIdx];
    var actualVD = (multiplier * K * I * L) / best.cm;
    var actualPct = (actualVD / V) * 100;

    rWire.textContent = best.gauge + ' AWG';
    rWire.style.color = '';
    rAmpacity.textContent = best[ampKey] + 'A';
    rActualDrop.textContent = actualVD.toFixed(2) + 'V (' + actualPct.toFixed(1) + '%)';
    rConduit.textContent = best.conduit + ' EMT';

    var html = '';
    var sizingReason = bestIdx === ampIdx && bestIdx === vdIdx ? 'both ampacity and voltage drop' :
                       bestIdx > ampIdx ? 'voltage drop (upsized from ' + wireData[ampIdx].gauge + ' AWG)' : 'ampacity';
    html += '<p style="margin:0 0 8px"><strong>Sized by:</strong> ' + sizingReason + '</p>';

    if (ampIdx !== -1) {
      html += '<p style="margin:0 0 8px"><strong>Ampacity minimum:</strong> ' + wireData[ampIdx].gauge + ' AWG (' + wireData[ampIdx][ampKey] + 'A rated)</p>';
    }
    if (vdIdx !== -1) {
      html += '<p style="margin:0 0 8px"><strong>Voltage drop minimum:</strong> ' + wireData[vdIdx].gauge + ' AWG (' + cmNeeded.toFixed(0) + ' CM needed, ' + wireData[vdIdx].cm.toLocaleString() + ' CM provided)</p>';
    }
    html += '<p style="margin:0"><strong>Voltage at load:</strong> ' + (V - actualVD).toFixed(1) + 'V</p>';

    resultDetails.innerHTML = html;
  }

  calcBtn.addEventListener('click', calculate);

  [voltage, phase, amperage, distance, conductor, maxDrop].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

})();
