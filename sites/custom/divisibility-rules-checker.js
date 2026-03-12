(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var number = parseFloat(document.getElementById('number').value) || 0;

    // Calculation logic
    var n=Math.abs(parseInt(number));if(n===0){document.getElementById('divisibleBy').textContent='Zero is divisible by every non-zero number';return;}var divs=[];for(var i=2;i<=10;i++){if(n%i===0)divs.push(i);}document.getElementById('divisibleBy').textContent=divs.length>0?n+' is divisible by: '+divs.join(', '):n+' is not divisible by any number from 2 to 10';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['number'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
