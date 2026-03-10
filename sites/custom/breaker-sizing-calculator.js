(function() {
  'use strict';

  // Standard breaker sizes
  var stdBreakers = [15, 20, 25, 30, 40, 50, 60, 70, 80, 100];

  // Breaker-to-wire mapping (copper, THHN 75°C)
  var breakerWire = {
    15: '14 AWG', 20: '12 AWG', 25: '10 AWG', 30: '10 AWG',
    40: '8 AWG', 50: '6 AWG', 60: '6 AWG', 70: '4 AWG',
    80: '3 AWG', 100: '3 AWG'
  };

  var loadType = document.getElementById('loadType');
  var loadAmps = document.getElementById('loadAmps');
  var voltage = document.getElementById('voltage');
  var phase = document.getElementById('phase');
  var calcBtn = document.getElementById('calcBtn');
  var rBreaker = document.getElementById('rBreaker');
  var rWire = document.getElementById('rWire');
  var rDesignAmps = document.getElementById('rDesignAmps');
  var rWattage = document.getElementById('rWattage');
  var resultDetails = document.getElementById('resultDetails');

  function calculate() {
    var amps = parseFloat(loadAmps.value);
    var V = parseFloat(voltage.value);

    if (isNaN(amps) || amps <= 0) {
      rBreaker.textContent = '—';
      rWire.textContent = '—';
      rDesignAmps.textContent = '—';
      rWattage.textContent = '—';
      resultDetails.innerHTML = '';
      return;
    }

    // Apply load type multiplier
    var designAmps;
    var rule;
    if (loadType.value === 'continuous') {
      designAmps = amps * 1.25;
      rule = 'Continuous: ' + amps.toFixed(1) + 'A × 1.25 = ' + designAmps.toFixed(1) + 'A';
    } else if (loadType.value === 'motor') {
      designAmps = amps * 1.25;
      rule = 'Motor: ' + amps.toFixed(1) + 'A FLA × 1.25 = ' + designAmps.toFixed(1) + 'A';
    } else {
      designAmps = amps;
      rule = 'Non-continuous: ' + amps.toFixed(1) + 'A (no derating)';
    }

    // Find standard breaker
    var breaker = null;
    for (var i = 0; i < stdBreakers.length; i++) {
      if (stdBreakers[i] >= designAmps) {
        breaker = stdBreakers[i];
        break;
      }
    }

    if (breaker === null) {
      rBreaker.textContent = '> 100A';
      rBreaker.style.color = '#dc2626';
      rWire.textContent = 'Consult engineer';
      rDesignAmps.textContent = designAmps.toFixed(1) + 'A';
      rWattage.textContent = '—';
      resultDetails.innerHTML = '<p style="color:#dc2626;margin:0">Load exceeds 100A standard breaker range. Consult a licensed electrician for service entrance or feeder sizing.</p>';
      return;
    }

    var wire = breakerWire[breaker];
    var phaseMult = phase.value === 'three' ? 1.732 : 1;
    var watts = V * amps * phaseMult;
    var maxContinuous = breaker * 0.8;

    rBreaker.textContent = breaker + 'A';
    rBreaker.style.color = '';
    rWire.textContent = wire;
    rDesignAmps.textContent = designAmps.toFixed(1) + 'A';
    rWattage.textContent = watts.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'W';

    var poleType = V > 150 ? 'Double-Pole' : 'Single-Pole';

    var html = '<p style="margin:0 0 8px"><strong>Sizing rule:</strong> ' + rule + '</p>';
    html += '<p style="margin:0 0 8px"><strong>Breaker type:</strong> ' + breaker + 'A ' + poleType + '</p>';
    html += '<p style="margin:0 0 8px"><strong>Max continuous load:</strong> ' + maxContinuous.toFixed(1) + 'A (80% of ' + breaker + 'A)</p>';
    html += '<p style="margin:0 0 8px"><strong>Circuit capacity:</strong> ' + (V * breaker * phaseMult).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'W maximum</p>';

    if (loadType.value === 'continuous' && amps > maxContinuous) {
      html += '<p style="margin:0;color:#ca8a04"><strong>Note:</strong> This breaker can only handle ' + maxContinuous.toFixed(1) + 'A continuously — your ' + amps.toFixed(1) + 'A load is properly sized.</p>';
    }

    resultDetails.innerHTML = html;
  }

  calcBtn.addEventListener('click', calculate);

  [loadType, loadAmps, voltage, phase].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

})();
