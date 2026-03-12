(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var shape = document.getElementById('shape').value;
    var dimension1 = parseFloat(document.getElementById('dimension1').value) || 0;
    var dimension2 = parseFloat(document.getElementById('dimension2').value) || 0;
    var dimension3 = parseFloat(document.getElementById('dimension3').value) || 0;

    // Calculation logic
    var d1=parseFloat(dimension1),d2=parseFloat(dimension2),d3=parseFloat(dimension3);var area,formula;if(shape==='rectangle'){area=d1*d2;formula='Area = length × width = '+d1+' × '+d2+' = '+fmt(area, 2);}else if(shape==='triangle'){area=0.5*d1*d2;formula='Area = ½ × base × height = ½ × '+d1+' × '+d2+' = '+fmt(area, 2);}else if(shape==='circle'){area=Math.PI*d1*d1;formula='Area = π × r² = π × '+d1+'² = '+fmt(area, 2);}else if(shape==='trapezoid'){area=0.5*(d1+d3)*d2;formula='Area = ½ × (b₁ + b₂) × h = ½ × ('+d1+' + '+d3+') × '+d2+' = '+fmt(area, 2);}document.getElementById('area').textContent=fmt(area, 2)+' square units';document.getElementById('formula').textContent=formula;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['shape', 'dimension1', 'dimension2', 'dimension3'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
