(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var shape = document.getElementById('shape').value;
    var dim1 = parseFloat(document.getElementById('dim1').value) || 0;
    var dim2 = parseFloat(document.getElementById('dim2').value) || 0;
    var dim3 = parseFloat(document.getElementById('dim3').value) || 0;

    // Calculation logic
    var d1=parseFloat(dim1),d2=parseFloat(dim2),d3=parseFloat(dim3);var sa,formula;if(shape==='cube'){sa=6*d1*d1;formula='SA = 6s² = 6 × '+d1+'² = '+fmt(sa, 2);}else if(shape==='rectangular-prism'){sa=2*(d1*d2+d2*d3+d1*d3);formula='SA = 2(lw + wh + lh) = 2('+d1+'×'+d2+' + '+d2+'×'+d3+' + '+d1+'×'+d3+') = '+fmt(sa, 2);}else if(shape==='cylinder'){sa=2*Math.PI*d1*d2+2*Math.PI*d1*d1;formula='SA = 2πrh + 2πr² = 2π('+d1+')('+d2+') + 2π('+d1+')² = '+fmt(sa, 2);}else if(shape==='sphere'){sa=4*Math.PI*d1*d1;formula='SA = 4πr² = 4π('+d1+')² = '+fmt(sa, 2);}document.getElementById('surfaceArea').textContent=fmt(sa, 2)+' square units';document.getElementById('formula').textContent=formula;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['shape', 'dim1', 'dim2', 'dim3'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
