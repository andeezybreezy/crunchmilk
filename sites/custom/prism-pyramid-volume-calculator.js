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
    var shape=document.getElementById('shape').value; var d1=parseFloat(document.getElementById('dim1').value); var d2=parseFloat(document.getElementById('dim2').value); var d3=parseFloat(document.getElementById('dim3').value); if(isNaN(d1)||d1<=0||isNaN(d2)||d2<=0||isNaN(d3)||d3<=0){document.getElementById('volume').textContent='Enter positive values';return;} var vol,sa; if(shape==='rectangular-prism'){vol=d1*d2*d3; sa=2*(d1*d2+d2*d3+d1*d3); document.getElementById('formula').textContent='V = l\u00D7w\u00D7h = '+d1+'\u00D7'+d2+'\u00D7'+d3;} else if(shape==='triangular-prism'){var baseArea=0.5*d1*d2; vol=baseArea*d3; var triSide=Math.sqrt((d1/2)*(d1/2)+d2*d2); sa=d1*d3+2*triSide*d3+2*baseArea; document.getElementById('formula').textContent='V = \u00BD\u00D7base\u00D7height\u00D7length';} else if(shape==='square-pyramid'){vol=(1/3)*d1*d1*d3; var slant=Math.sqrt((d1/2)*(d1/2)+d3*d3); sa=d1*d1+2*d1*slant; document.getElementById('formula').textContent='V = \u2153\u00D7base\u00B2\u00D7h = \u2153\u00D7'+d1+'\u00B2\u00D7'+d3;} else {var baseArea=(Math.sqrt(3)/4)*d1*d1; vol=(1/3)*baseArea*d3; var slant=Math.sqrt((d1/Math.sqrt(3))*(d1/Math.sqrt(3))+d3*d3); sa=baseArea+1.5*d1*slant; document.getElementById('formula').textContent='V = \u2153\u00D7(\u221A3/4)\u00D7a\u00B2\u00D7h';} document.getElementById('volume').textContent=fmt(vol, 2); document.getElementById('surfaceArea').textContent=fmt(sa, 2);

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
