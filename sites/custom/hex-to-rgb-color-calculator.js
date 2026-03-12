(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var red = parseFloat(document.getElementById('red').value) || 0;
    var green = parseFloat(document.getElementById('green').value) || 0;
    var blue = parseFloat(document.getElementById('blue').value) || 0;

    // Calculation logic
    var hex = '#' + ('0'+red.toString(16)).slice(-2) + ('0'+green.toString(16)).slice(-2) + ('0'+blue.toString(16)).slice(-2); var r = red/255; var g = green/255; var b = blue/255; var max = Math.max(r,g,b); var min = Math.min(r,g,b); var l = (max+min)/2; var s = max===min ? 0 : l > 0.5 ? (max-min)/(2-max-min) : (max-min)/(max+min); var h = 0; if(max!==min){if(max===r)h=(g-b)/(max-min)+(g<b?6:0);else if(max===g)h=(b-r)/(max-min)+2;else h=(r-g)/(max-min)+4;h/=6;} var hsl = fmt(h*360,0) + ', ' + fmt(s*100,0) + '%, ' + fmt(l*100,0) + '%';     document.getElementById('hex').textContent = hex.toUpperCase();
    document.getElementById('rgb').textContent = red+', '+green+', '+blue;
    document.getElementById('hsl').textContent = hsl;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['red', 'green', 'blue'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
