(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var comp = parseFloat(document.getElementById('comp').value) || 0;
    var att = parseFloat(document.getElementById('att').value) || 0;
    var yards = parseFloat(document.getElementById('yards').value) || 0;
    var td = parseFloat(document.getElementById('td').value) || 0;
    var ints = parseFloat(document.getElementById('ints').value) || 0;

    // Calculation logic
    var a = Math.min(Math.max(((comp/att)-0.3)*5, 0), 2.375); var b = Math.min(Math.max(((yards/att)-3)*0.25, 0), 2.375); var c = Math.min(Math.max((td/att)*20, 0), 2.375); var d = Math.min(Math.max(2.375-((ints/att)*25), 0), 2.375); var pr = ((a+b+c+d)/6)*100; var grade = pr >= 100 ? 'Elite' : pr >= 90 ? 'Excellent' : pr >= 80 ? 'Good' : pr >= 70 ? 'Average' : 'Below Average'; document.getElementById('rating').textContent = fmt(pr, 1); document.getElementById('grade').textContent = grade; document.getElementById('compPct').textContent = pct(comp/att*100, 1); document.getElementById('ypa').textContent = fmt(yards/att, 1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['comp', 'att', 'yards', 'td', 'ints'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
