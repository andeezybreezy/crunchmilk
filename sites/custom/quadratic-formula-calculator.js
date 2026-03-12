(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;
    var c = parseFloat(document.getElementById('c').value) || 0;

    // Calculation logic
    var disc=b*b-4*a*c;document.getElementById('discriminant').textContent=fmt(disc, 2);var vx=-b/(2*a);var vy=a*vx*vx+b*vx+c;document.getElementById('vertex').textContent='('+fmt(vx, 2)+', '+fmt(vy, 2)+')';if(disc>0){var r1=(-b+Math.sqrt(disc))/(2*a);var r2=(-b-Math.sqrt(disc))/(2*a);document.getElementById('root1').textContent=fmt(r1, 2);document.getElementById('root2').textContent=fmt(r2, 2);document.getElementById('numSolutions').textContent='2 real solutions';}else if(disc===0){var r=-b/(2*a);document.getElementById('root1').textContent=fmt(r, 2);document.getElementById('root2').textContent=fmt(r, 2)+' (repeated root)';document.getElementById('numSolutions').textContent='1 real solution (repeated)';}else{var real=-b/(2*a);var imag=Math.sqrt(-disc)/(2*a);document.getElementById('root1').textContent=fmt(real, 2)+' + '+fmt(imag, 2)+'i';document.getElementById('root2').textContent=fmt(real, 2)+' - '+fmt(imag, 2)+'i';document.getElementById('numSolutions').textContent='2 complex solutions (no real roots)';}

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
