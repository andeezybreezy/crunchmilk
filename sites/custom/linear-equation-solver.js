(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;
    var c = parseFloat(document.getElementById('c').value) || 0;

    // Calculation logic
    if(a===0){if(b===c){document.getElementById('solution').textContent='All real numbers';document.getElementById('steps').textContent='0x + '+b+' = '+c+' → '+b+' = '+c+' (always true)';}else{document.getElementById('solution').textContent='No solution';document.getElementById('steps').textContent='0x + '+b+' = '+c+' → '+b+' = '+c+' (contradiction)';}}else{var x=(c-b)/a;document.getElementById('solution').textContent='x = '+fmt(x,4);document.getElementById('steps').textContent=a+'x + '+b+' = '+c+' → '+a+'x = '+(c-b)+' → x = '+(c-b)+'/'+a+' = '+fmt(x,4);}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a', 'b', 'c'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
