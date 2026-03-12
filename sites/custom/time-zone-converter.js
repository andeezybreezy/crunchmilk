(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hour = parseFloat(document.getElementById('hour').value) || 0;
    var fromZone = document.getElementById('fromZone').value;
    var toZone = document.getElementById('toZone').value;

    // Calculation logic
    var diff=parseFloat(toZone)-parseFloat(fromZone); var newHour=hour+diff; var dayShift='Same day'; if(newHour>=24){newHour-=24;dayShift='Next day';}else if(newHour<0){newHour+=24;dayShift='Previous day';} var h=Math.floor(newHour); var m=Math.round((newHour-h)*60); var timeStr=h.toString().padStart(2,'0')+':'+(m>0?m.toString().padStart(2,'0'):'00'); var period=h>=12?'PM':'AM'; var h12=h>12?h-12:(h===0?12:h);     document.getElementById('convertedTime').textContent = h12+':'+(m>0?m.toString().padStart(2,'0'):'00')+' '+period+' ('+timeStr+')';
    document.getElementById('difference').textContent = (diff>=0?'+':'')+diff+' hours';
    document.getElementById('dayShift').textContent = dayShift;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hour', 'fromZone', 'toZone'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
