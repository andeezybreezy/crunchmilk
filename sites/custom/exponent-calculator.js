(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var base = parseFloat(document.getElementById('base').value) || 0;
    var exponent = parseFloat(document.getElementById('exponent').value) || 0;

    // Calculation logic
    var b=parseFloat(base),e=parseInt(exponent);var result=Math.pow(b,e);document.getElementById('answer').textContent=fmt(result,6);if(e>=0&&e<=20&&Number.isInteger(e)){var parts=[];for(var i=0;i<e;i++)parts.push(b);document.getElementById('expanded').textContent=b+'^'+e+' = '+(parts.length>0?parts.join(' × ')+' = '+fmt(result,6):'1');}else{document.getElementById('expanded').textContent=b+'^'+e+' = '+fmt(result,6);}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['base', 'exponent'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
