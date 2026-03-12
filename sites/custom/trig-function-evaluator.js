(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var angle = parseFloat(document.getElementById('angle').value) || 0;
    var angleUnit = document.getElementById('angleUnit').value;

    // Calculation logic
    var angle=parseFloat(document.getElementById('angle').value); var unit=document.getElementById('angleUnit').value; if(isNaN(angle)){document.getElementById('sin').textContent='Enter a number';return;} var rad=unit==='degrees'?angle*Math.PI/180:angle; var sinVal=Math.sin(rad); var cosVal=Math.cos(rad); var tanVal; if(Math.abs(cosVal)<1e-10){tanVal='Undefined';} else {tanVal=sinVal/cosVal;} document.getElementById('sin').textContent=fmt(sinVal,8); document.getElementById('cos').textContent=fmt(cosVal,8); document.getElementById('tan').textContent=(typeof tanVal==='string')?tanVal:fmt(tanVal,8); document.getElementById('csc').textContent=Math.abs(sinVal)<1e-10?'Undefined':fmt(1/sinVal,8); document.getElementById('sec').textContent=Math.abs(cosVal)<1e-10?'Undefined':fmt(1/cosVal,8); document.getElementById('cot').textContent=(typeof tanVal==='string')?'0':Math.abs(tanVal)<1e-10?'Undefined':fmt(1/tanVal,8);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['angle', 'angleUnit'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
