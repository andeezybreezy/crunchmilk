(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var wakeTime = parseFloat(document.getElementById('wakeTime').value) || 0;
    var cycles = parseFloat(document.getElementById('cycles').value) || 0;
    var fallAsleep = parseFloat(document.getElementById('fallAsleep').value) || 0;

    // Calculation logic
    var cycleMin = 90; var totalSleepMin = cycles * cycleMin; var totalMin = totalSleepMin + fallAsleep; var bedtimeMin = (wakeTime * 60 - totalMin + 1440) % 1440; var bedHour = Math.floor(bedtimeMin / 60); var bedMin = bedtimeMin % 60; var ampm = bedHour >= 12 ? 'PM' : 'AM'; var displayHour = bedHour > 12 ? bedHour - 12 : bedHour === 0 ? 12 : bedHour; var bedtime = displayHour + ':' + (bedMin < 10 ? '0' : '') + bedMin + ' ' + ampm; var sleepHours = totalSleepMin / 60; var quality = cycles >= 5 ? 'Optimal' : cycles === 4 ? 'Adequate' : 'Below recommended';     document.getElementById('bedtime').textContent = bedtime;
    document.getElementById('sleepHours').textContent = fmt(sleepHours,1);
    document.getElementById('quality').textContent = quality;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['wakeTime', 'cycles', 'fallAsleep'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
