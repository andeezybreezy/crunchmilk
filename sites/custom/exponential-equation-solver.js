(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var base = parseFloat(document.getElementById('base').value) || 0;
    var result = parseFloat(document.getElementById('result').value) || 0;

    // Calculation logic
    if(base<=0||base===1){document.getElementById('exponent').textContent='Error: base must be positive and ≠ 1';document.getElementById('steps').textContent='—';return;}if(result<=0){document.getElementById('exponent').textContent='No real solution (result must be > 0)';document.getElementById('steps').textContent='—';return;}var x=Math.log(result)/Math.log(base);document.getElementById('exponent').textContent=fmt(x,6);document.getElementById('steps').textContent=base+'^x = '+result+' → x = log('+result+')/log('+base+') = '+fmt(Math.log(result),6)+'/'+fmt(Math.log(base),6)+' = '+fmt(x,6);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['base', 'result'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
