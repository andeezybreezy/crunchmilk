(function() {
  'use strict';

  function calculate() {
    var volume = parseFloat(document.getElementById('volume').value);
    var hours = parseFloat(document.getElementById('timeHours').value) || 0;
    var minutes = parseFloat(document.getElementById('timeMinutes').value) || 0;
    var dropFactor = parseInt(document.getElementById('dropFactor').value, 10);

    var totalMinutes = (hours * 60) + minutes;
    if (isNaN(volume) || volume <= 0 || totalMinutes <= 0) return;

    var totalHours = totalMinutes / 60;
    var dropsPerMin = (volume * dropFactor) / totalMinutes;
    var mlPerHr = volume / totalHours;

    var timeDisplay = '';
    var h = Math.floor(totalMinutes / 60);
    var m = Math.round(totalMinutes % 60);
    if (h > 0) timeDisplay += h + ' hr';
    if (m > 0) timeDisplay += (h > 0 ? ' ' : '') + m + ' min';

    document.getElementById('dropsMin').textContent = Math.round(dropsPerMin) + ' gtt/min';
    document.getElementById('mlHr').textContent = mlPerHr.toFixed(1) + ' mL/hr';
    document.getElementById('totalTime').textContent = timeDisplay;
    document.getElementById('totalVol').textContent = volume + ' mL';

    var tip = 'Using ' + dropFactor + ' gtt/mL tubing. ';
    if (dropFactor === 60) {
      tip += 'Microdrip shortcut: drops/min (' + Math.round(dropsPerMin) + ') ≈ mL/hr (' + mlPerHr.toFixed(0) + ').';
    } else {
      tip += 'Count drops for 15 seconds and multiply by 4 to verify rate.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
