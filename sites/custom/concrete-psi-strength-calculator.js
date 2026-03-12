(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var application = document.getElementById('application').value;
    var cubicYards = parseFloat(document.getElementById('cubicYards').value) || 0;
    var thickness = parseFloat(document.getElementById('thickness').value) || 0;

    // Calculation logic
    var psiMap = {sidewalk:3000,driveway:4000,garage:4000,foundation:3500,structural:5000,highrise:6000}; var psi = psiMap[application] || 3000; var bags = Math.ceil(cubicYards * 45); var costPerYard = psi <= 3000 ? 130 : psi <= 4000 ? 145 : psi <= 5000 ? 165 : 190; var cost = cubicYards * costPerYard; var cure = 28; document.getElementById('recPsi').textContent = fmt(psi, 0) + ' PSI'; document.getElementById('bags').textContent = fmt(bags, 0); document.getElementById('estCost').textContent = dollar(cost); document.getElementById('cureTime').textContent = cure + ' days';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['application', 'cubicYards', 'thickness'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
