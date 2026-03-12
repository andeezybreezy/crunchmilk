(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;

    // Calculation logic
    if(a===0){document.getElementById('inverse').textContent='No inverse (horizontal line fails horizontal line test)';document.getElementById('verification').textContent='f(x) = '+b+' is not one-to-one';return;}var invSlope=1/a;var invB=-b/a;var bStr=invB>=0?' + '+fmt(Math.abs(invB),4):' - '+fmt(Math.abs(invB),4);document.getElementById('inverse').textContent='f⁻¹(x) = '+fmt(invSlope,4)+'x'+bStr;document.getElementById('verification').textContent='f(f⁻¹(x)) = '+a+'('+fmt(invSlope,4)+'x'+bStr+') + ('+b+') = x ✓';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a', 'b'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
