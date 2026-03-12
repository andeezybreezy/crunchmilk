(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dividendA = parseFloat(document.getElementById('dividendA').value) || 0;
    var dividendB = parseFloat(document.getElementById('dividendB').value) || 0;
    var dividendC = parseFloat(document.getElementById('dividendC').value) || 0;
    var divisorA = parseFloat(document.getElementById('divisorA').value) || 0;
    var divisorB = parseFloat(document.getElementById('divisorB').value) || 0;

    // Calculation logic
    if(divisorA===0){document.getElementById('quotient').textContent='Error: divisor x coefficient cannot be 0';document.getElementById('remainder').textContent='—';return;}var q1=dividendA/divisorA;var remB=dividendB-q1*divisorB;var q0=remB/divisorA;var rem=dividendC-q0*divisorB;var qStr=fmt(q1, 2)+'x'+(q0>=0?' + '+fmt(q0, 2):' - '+fmt(Math.abs(q0), 2));document.getElementById('quotient').textContent=qStr;document.getElementById('remainder').textContent=fmt(rem, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dividendA', 'dividendB', 'dividendC', 'divisorA', 'divisorB'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
