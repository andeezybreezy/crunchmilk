(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var readingPages = parseFloat(document.getElementById('readingPages').value) || 0;
    var mathProblems = parseFloat(document.getElementById('mathProblems').value) || 0;
    var writingWords = parseFloat(document.getElementById('writingWords').value) || 0;
    var difficulty = document.getElementById('difficulty').value;
    var gradeLevel = document.getElementById('gradeLevel').value;

    // Calculation logic
    var diff = parseFloat(difficulty);
    var speeds = {elem: {read: 3, math: 5, write: 8}, ms: {read: 2.5, math: 4, write: 6}, hs: {read: 2, math: 5, write: 5}, college: {read: 3, math: 6, write: 4}};
    var s = speeds[gradeLevel];
    var readMin = readingPages * s.read * diff;
    var mathMin = mathProblems * s.math * diff;
    var writeMin = (writingWords / 100) * s.write * diff;
    var total = readMin + mathMin + writeMin;
    var hrs = Math.floor(total / 60);
    var mins = Math.round(total % 60);
    var breaks = Math.floor(total / 25);
    var breakSched = breaks > 0 ? breaks + ' breaks (Pomodoro: 25 min work, 5 min break)' : 'No breaks needed (under 25 min)';
    document.getElementById('readingTime').textContent = fmt(readMin, 0) + ' min';
    document.getElementById('mathTime').textContent = fmt(mathMin, 0) + ' min';
    document.getElementById('writingTime').textContent = fmt(writeMin, 0) + ' min';
    document.getElementById('totalTime').textContent = (hrs > 0 ? hrs + 'h ' : '') + mins + ' min';
    document.getElementById('breakSchedule').textContent = breakSched;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['readingPages', 'mathProblems', 'writingWords', 'difficulty', 'gradeLevel'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
