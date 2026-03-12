(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var shape = document.getElementById('shape').value;
    var dim1 = parseFloat(document.getElementById('dim1').value) || 0;
    var dim2 = parseFloat(document.getElementById('dim2').value) || 0;
    var dim3 = parseFloat(document.getElementById('dim3').value) || 0;

    // Calculation logic
    var d1=parseFloat(dim1),d2=parseFloat(dim2),d3=parseFloat(dim3);var vol,formula;if(shape==='cube'){vol=d1*d1*d1;formula='V = s³ = '+d1+'³ = '+fmt(vol,4);}else if(shape==='rectangular-prism'){vol=d1*d2*d3;formula='V = l × w × h = '+d1+' × '+d2+' × '+d3+' = '+fmt(vol,4);}else if(shape==='cylinder'){vol=Math.PI*d1*d1*d2;formula='V = πr²h = π × '+d1+'² × '+d2+' = '+fmt(vol,4);}else if(shape==='cone'){vol=(1/3)*Math.PI*d1*d1*d2;formula='V = ⅓πr²h = ⅓ × π × '+d1+'² × '+d2+' = '+fmt(vol,4);}else if(shape==='sphere'){vol=(4/3)*Math.PI*d1*d1*d1;formula='V = ⁴⁄₃πr³ = ⁴⁄₃ × π × '+d1+'³ = '+fmt(vol,4);}document.getElementById('volume').textContent=fmt(vol,4)+' cubic units';document.getElementById('formula').textContent=formula;

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
