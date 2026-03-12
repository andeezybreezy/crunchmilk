(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var fType = document.getElementById('fType').value;
    var fA = parseFloat(document.getElementById('fA').value) || 0;
    var fB = parseFloat(document.getElementById('fB').value) || 0;
    var gA = parseFloat(document.getElementById('gA').value) || 0;
    var gB = parseFloat(document.getElementById('gB').value) || 0;
    var xValue = parseFloat(document.getElementById('xValue').value) || 0;

    // Calculation logic
    var ft=document.getElementById('fType').value;var gx=gA*xValue+gB;var fogVal;if(ft==='linear'){fogVal=fA*gx+fB;}else{fogVal=fA*gx*gx+fB;}var fx;if(ft==='linear'){fx=fA*xValue+fB;}else{fx=fA*xValue*xValue+fB;}var gofVal=gA*fx+gB;document.getElementById('fogx').textContent='f(g('+xValue+')) = f('+fmt(gx, 2)+') = '+fmt(fogVal, 2);document.getElementById('gofx').textContent='g(f('+xValue+')) = g('+fmt(fx, 2)+') = '+fmt(gofVal, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['fType', 'fA', 'fB', 'gA', 'gB', 'xValue'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
