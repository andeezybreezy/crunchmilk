(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var shape = document.getElementById('shape').value;
    var radius = parseFloat(document.getElementById('radius').value) || 0;
    var height = parseFloat(document.getElementById('height').value) || 0;

    // Calculation logic
    var shape=document.getElementById('shape').value; var r=parseFloat(document.getElementById('radius').value); var h=parseFloat(document.getElementById('height').value); if(isNaN(r)||r<=0){document.getElementById('volume').textContent='Enter a positive radius';return;} var vol,sa; if(shape==='sphere'){vol=(4/3)*Math.PI*r*r*r; sa=4*Math.PI*r*r; document.getElementById('formula').textContent='V = (4/3)\u03C0r\u00B3; SA = 4\u03C0r\u00B2';} else if(shape==='cone'){if(isNaN(h)||h<=0){document.getElementById('volume').textContent='Enter a positive height';return;} vol=(1/3)*Math.PI*r*r*h; var slant=Math.sqrt(r*r+h*h); sa=Math.PI*r*(r+slant); document.getElementById('formula').textContent='V = (1/3)\u03C0r\u00B2h; SA = \u03C0r(r + slant)';} else {if(isNaN(h)||h<=0){document.getElementById('volume').textContent='Enter a positive height';return;} vol=Math.PI*r*r*h; sa=2*Math.PI*r*(r+h); document.getElementById('formula').textContent='V = \u03C0r\u00B2h; SA = 2\u03C0r(r + h)';} document.getElementById('volume').textContent=fmt(vol,4); document.getElementById('surfaceArea').textContent=fmt(sa,4);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['shape', 'radius', 'height'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
