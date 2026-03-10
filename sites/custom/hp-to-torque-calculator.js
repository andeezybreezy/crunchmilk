(function() {
  'use strict';

  var modeSel = document.getElementById('calcMode');
  var hpIn = document.getElementById('hpInput');
  var torqueIn = document.getElementById('torqueInput');
  var rpmIn = document.getElementById('rpmInput');
  var hpGroup = document.getElementById('hpGroup');
  var torqueGroup = document.getElementById('torqueGroup');
  var rpmGroup = document.getElementById('rpmGroup');

  function updateVisibility() {
    var mode = modeSel.value;
    hpGroup.style.display = mode === 'hp' ? 'none' : '';
    torqueGroup.style.display = mode === 'torque' ? 'none' : '';
    rpmGroup.style.display = mode === 'rpm' ? 'none' : '';
  }

  modeSel.addEventListener('change', updateVisibility);
  updateVisibility();

  function calculate() {
    var mode = modeSel.value;
    var hp, torque, rpm, result, label;

    if (mode === 'hp') {
      torque = parseFloat(torqueIn.value);
      rpm = parseFloat(rpmIn.value);
      if (isNaN(torque) || isNaN(rpm) || torque <= 0 || rpm <= 0) return;
      hp = torque * rpm / 5252;
      result = hp.toFixed(1) + ' HP';
      label = 'Horsepower';
    } else if (mode === 'torque') {
      hp = parseFloat(hpIn.value);
      rpm = parseFloat(rpmIn.value);
      if (isNaN(hp) || isNaN(rpm) || hp <= 0 || rpm <= 0) return;
      torque = hp * 5252 / rpm;
      result = torque.toFixed(1) + ' lb-ft';
      label = 'Torque';
    } else {
      hp = parseFloat(hpIn.value);
      torque = parseFloat(torqueIn.value);
      if (isNaN(hp) || isNaN(torque) || hp <= 0 || torque <= 0) return;
      rpm = hp * 5252 / torque;
      result = Math.round(rpm) + ' RPM';
      label = 'RPM';
    }

    // Fill in all three values
    if (mode === 'hp') {
      hpIn.value = hp.toFixed(1);
    } else if (mode === 'torque') {
      torqueIn.value = torque.toFixed(1);
    } else {
      rpmIn.value = Math.round(rpm);
    }

    document.getElementById('resultLabel').textContent = label;
    document.getElementById('resultValue').textContent = result;
    document.getElementById('dispHP').textContent = (hp || parseFloat(hpIn.value)).toFixed(1) + ' HP';
    document.getElementById('dispTorque').textContent = (torque || parseFloat(torqueIn.value)).toFixed(1) + ' lb-ft';
    document.getElementById('dispRPM').textContent = Math.round(rpm || parseFloat(rpmIn.value)) + ' RPM';

    document.getElementById('resultTip').textContent =
      'Remember: HP and torque always cross at exactly 5,252 RPM on a dyno chart. At that RPM, HP = Torque numerically.';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('.calc-card input');
  inputs.forEach(function(inp) {
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
