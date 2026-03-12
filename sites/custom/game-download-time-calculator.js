(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var fileSize = parseFloat(document.getElementById('fileSize').value) || 0;
    var speed = parseFloat(document.getElementById('speed').value) || 0;

    // Calculation logic
    var fileMB=fileSize*1024; var speedMBps=speed/8; var seconds=fileMB/speedMBps; var mins=seconds/60; var atPeak=mins/0.8; var hours=Math.floor(mins/60); var remainMins=Math.round(mins%60); var peakHours=Math.floor(atPeak/60); var peakMins=Math.round(atPeak%60); var timeStr=hours>0?hours+'h '+remainMins+'m':remainMins+' min'; var peakStr=peakHours>0?peakHours+'h '+peakMins+'m':peakMins+' min';     document.getElementById('time').textContent = timeStr;
    document.getElementById('atPeak').textContent = peakStr+' (realistic)';
    document.getElementById('dataUsed').textContent = fileSize+' GB';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['fileSize', 'speed'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
