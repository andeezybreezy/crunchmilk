(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var violationType = document.getElementById('violationType').value;
    var severity = document.getElementById('severity').value;
    var overweightLbs = parseFloat(document.getElementById('overweightLbs').value) || 0;
    var numViolations = parseFloat(document.getElementById('numViolations').value) || 0;
    var hasAttorney = document.getElementById('hasAttorney').value;

    // Calculation logic
    var fines = {hos:{minor:1000,moderate:2750,severe:5500},eld:{minor:1000,moderate:2500,severe:5000},overweight:{minor:500,moderate:2000,severe:5000},vehicle:{minor:1500,moderate:4000,severe:8000},hazmat:{minor:2000,moderate:10000,severe:25000},medical:{minor:500,moderate:2500,severe:5000}}; var maxFines = {hos:16000,eld:16000,overweight:16000,vehicle:26000,hazmat:79000,medical:16000}; var base = fines[violationType] ? fines[violationType][severity] : 1000; if(violationType === 'overweight' && overweightLbs > 0) { base = Math.max(base, overweightLbs * 0.15 + 500); } var total = base * numViolations; var maxF = maxFines[violationType] || 16000; total = Math.min(total, maxF); var attCost = hasAttorney === 'yes' ? Math.max(500, total * 0.4) : 0; var reduced = hasAttorney === 'yes' ? total * 0.55 : total; var csaPoints = severity === 'minor' ? '1-3 points' : severity === 'moderate' ? '4-6 points' : '7-10 points'; document.getElementById('baseFine').textContent = dollar(base); document.getElementById('totalFine').textContent = dollar(total); document.getElementById('maxFine').textContent = dollar(maxF); document.getElementById('attorneyCost').textContent = hasAttorney === 'yes' ? dollar(attCost) : 'N/A'; document.getElementById('reducedFine').textContent = hasAttorney === 'yes' ? dollar(reduced) : 'N/A'; document.getElementById('csaImpact').textContent = csaPoints;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['violationType', 'severity', 'overweightLbs', 'numViolations', 'hasAttorney'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
