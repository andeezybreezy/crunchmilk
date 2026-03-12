(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var initial = parseFloat(document.getElementById('initial').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;
    var time = parseFloat(document.getElementById('time').value) || 0;
    var type = document.getElementById('type').value;

    // Calculation logic
    var P=parseFloat(document.getElementById('initial').value); var rate=parseFloat(document.getElementById('rate').value); var t=parseFloat(document.getElementById('time').value); var type=document.getElementById('type').value; if(isNaN(P)||P<=0||isNaN(rate)||rate<=0||isNaN(t)||t<0){document.getElementById('finalAmount').textContent='Enter positive values';return;} var r=rate/100; var result; if(type==='growth'){result=P*Math.pow(1+r,t); var doubling=Math.log(2)/Math.log(1+r); document.getElementById('doublingTime').textContent='Doubling time: '+fmt(doubling, 2)+' periods'; document.getElementById('formula').textContent='A = '+P+' \u00D7 (1 + '+fmt(r, 2)+')^'+t+' = '+fmt(result,2);} else {result=P*Math.pow(1-r,t); if(r>=1){document.getElementById('finalAmount').textContent='Rate must be less than 100% for decay';return;} var halfLife=Math.log(0.5)/Math.log(1-r); document.getElementById('doublingTime').textContent='Half-life: '+fmt(halfLife, 2)+' periods'; document.getElementById('formula').textContent='A = '+P+' \u00D7 (1 - '+fmt(r, 2)+')^'+t+' = '+fmt(result,2);} document.getElementById('finalAmount').textContent=fmt(result,2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['initial', 'rate', 'time', 'type'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
