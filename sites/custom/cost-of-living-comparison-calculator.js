(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var salary = parseFloat(document.getElementById('salary').value) || 0;
    var inflationRate = parseFloat(document.getElementById('inflationRate').value) || 0;
    var raiseReceived = parseFloat(document.getElementById('raiseReceived').value) || 0;

    // Calculation logic
    var colaSalary=salary*(1+inflationRate/100); var newSalary=salary*(1+raiseReceived/100); var gap=newSalary-colaSalary; var realChange=((raiseReceived-inflationRate)/(100+inflationRate))*100; var monthlyImpact=gap/12;     document.getElementById('colaSalary').textContent = dollar(colaSalary);
    document.getElementById('yourNewSalary').textContent = dollar(newSalary);
    document.getElementById('gap').textContent = dollar(gap)+(gap>=0?' ahead':' behind');
    document.getElementById('realChange').textContent = fmt(realChange,2)+'%';
    document.getElementById('monthlyImpact').textContent = dollar(monthlyImpact)+'/month';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['salary', 'inflationRate', 'raiseReceived'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
