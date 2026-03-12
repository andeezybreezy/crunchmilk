(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var oldSalary = parseFloat(document.getElementById('oldSalary').value) || 0;
    var newSalary = parseFloat(document.getElementById('newSalary').value) || 0;
    var inflationRate = parseFloat(document.getElementById('inflationRate').value) || 0;

    // Calculation logic
    var nominalRaise=newSalary-oldSalary; var nominalPct=(nominalRaise/oldSalary)*100; var realSalary=newSalary/(1+inflationRate/100); var realRaise=realSalary-oldSalary; var realPct=(realRaise/oldSalary)*100; var verdict=realRaise>0?'You got a real raise of '+dollar(realRaise):'You took a real pay CUT of '+dollar(Math.abs(realRaise));     document.getElementById('nominalRaise').textContent = dollar(nominalRaise);
    document.getElementById('nominalPct').textContent = fmt(nominalPct,1)+'%';
    document.getElementById('realRaise').textContent = dollar(realRaise);
    document.getElementById('realPct').textContent = fmt(realPct,1)+'%';
    document.getElementById('verdict').textContent = verdict;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['oldSalary', 'newSalary', 'inflationRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
