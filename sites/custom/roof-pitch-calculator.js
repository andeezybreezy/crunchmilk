(function() {
  'use strict';

  var methodSelect = document.getElementById('inputMethod');
  var riseRunInputs = document.getElementById('riseRunInputs');
  var pitchInput = document.getElementById('pitchInput');
  var degreesInput = document.getElementById('degreesInput');
  var rise = document.getElementById('rise');
  var run = document.getElementById('run');
  var pitchVal = document.getElementById('pitchVal');
  var degreesVal = document.getElementById('degreesVal');

  var outPitch = document.getElementById('outPitch');
  var outDegrees = document.getElementById('outDegrees');
  var outRise = document.getElementById('outRise');
  var outRafter = document.getElementById('outRafter');
  var outMultiplier = document.getElementById('outMultiplier');
  var outPercent = document.getElementById('outPercent');
  var resultTip = document.getElementById('resultTip');

  function showMethod(method) {
    riseRunInputs.style.display = method === 'riserun' ? '' : 'none';
    pitchInput.style.display = method === 'pitch' ? '' : 'none';
    degreesInput.style.display = method === 'degrees' ? '' : 'none';
  }

  methodSelect.addEventListener('change', function() {
    showMethod(methodSelect.value);
    calculate();
  });

  function getTip(pitchX) {
    if (pitchX < 1) return 'Very flat — requires membrane or built-up roofing.';
    if (pitchX < 2) return 'Low slope — consider standing seam metal roofing.';
    if (pitchX < 4) return 'Low slope — requires double underlayment for shingles.';
    if (pitchX < 7) return 'Standard slope — suitable for asphalt shingles with standard underlayment.';
    if (pitchX < 10) return 'Moderate steep — good water and snow shedding.';
    if (pitchX < 13) return 'Steep slope — consider walkboards for safety during installation.';
    return 'Very steep — special equipment and safety measures required.';
  }

  function calculate() {
    var method = methodSelect.value;
    var riseInches, runInches, pitchX, angleDeg;

    if (method === 'riserun') {
      riseInches = parseFloat(rise.value);
      runInches = parseFloat(run.value);
      if (isNaN(riseInches) || isNaN(runInches) || runInches <= 0) { clear(); return; }
      pitchX = (riseInches / runInches) * 12;
      angleDeg = Math.atan(riseInches / runInches) * (180 / Math.PI);
    } else if (method === 'pitch') {
      pitchX = parseFloat(pitchVal.value);
      if (isNaN(pitchX) || pitchX < 0) { clear(); return; }
      riseInches = pitchX;
      runInches = 12;
      angleDeg = Math.atan(pitchX / 12) * (180 / Math.PI);
    } else {
      angleDeg = parseFloat(degreesVal.value);
      if (isNaN(angleDeg) || angleDeg < 0 || angleDeg >= 90) { clear(); return; }
      var angleRad = angleDeg * Math.PI / 180;
      pitchX = 12 * Math.tan(angleRad);
      riseInches = pitchX;
      runInches = 12;
    }

    var angleRad = angleDeg * Math.PI / 180;
    var rafterPerFoot = Math.sqrt(144 + riseInches * riseInches / (runInches * runInches / 144));
    rafterPerFoot = Math.sqrt(144 + pitchX * pitchX);
    var multiplier = 1 / Math.cos(angleRad);
    var slopePct = (pitchX / 12) * 100;

    outPitch.textContent = pitchX.toFixed(2) + ' / 12';
    outDegrees.innerHTML = angleDeg.toFixed(2) + '&deg;';
    outRise.textContent = pitchX.toFixed(2) + '"';
    outRafter.textContent = rafterPerFoot.toFixed(2) + '"';
    outMultiplier.textContent = multiplier.toFixed(3);
    outPercent.textContent = slopePct.toFixed(1) + '%';
    resultTip.textContent = getTip(pitchX);
  }

  function clear() {
    outPitch.textContent = '—';
    outDegrees.textContent = '—';
    outRise.textContent = '—';
    outRafter.textContent = '—';
    outMultiplier.textContent = '—';
    outPercent.textContent = '—';
    resultTip.textContent = 'Enter a value above to calculate.';
  }

  rise.addEventListener('input', calculate);
  run.addEventListener('input', calculate);
  pitchVal.addEventListener('input', calculate);
  degreesVal.addEventListener('input', calculate);

  calculate();
})();
