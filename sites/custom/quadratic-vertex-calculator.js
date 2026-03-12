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
    var vx=-b/(2*a);var vy=a*vx*vx+b*vx+c;document.getElementById('vertexX').textContent=fmt(vx,4);document.getElementById('vertexY').textContent=fmt(vy,4);document.getElementById('axisOfSymmetry').textContent='x = '+fmt(vx,4);document.getElementById('direction').textContent=a>0?'Opens upward':'Opens downward';document.getElementById('minOrMax').textContent=a>0?'Minimum value: '+fmt(vy,4):'Maximum value: '+fmt(vy,4);

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
