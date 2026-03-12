(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var slope = parseFloat(document.getElementById('slope').value) || 0;
    var x1 = parseFloat(document.getElementById('x1').value) || 0;
    var y1 = parseFloat(document.getElementById('y1').value) || 0;
    var lineType = document.getElementById('lineType').value;

    // Calculation logic
    var lt=document.getElementById('lineType').value;var m2;if(lt==='parallel'){m2=slope;}else{if(slope===0){document.getElementById('newSlope').textContent='Undefined';document.getElementById('equation').textContent='x = '+x1;return;}m2=-1/slope;}var b=y1-m2*x1;var bStr=b>=0?' + '+fmt(Math.abs(b),4):' - '+fmt(Math.abs(b),4);document.getElementById('newSlope').textContent=fmt(m2,4);document.getElementById('equation').textContent='y = '+fmt(m2,4)+'x'+bStr;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['slope', 'x1', 'y1', 'lineType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
