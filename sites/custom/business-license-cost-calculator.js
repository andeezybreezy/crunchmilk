(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var entityType = document.getElementById('entityType').value;
    var state = document.getElementById('state').value;
    var needsEin = document.getElementById('needsEin').value;

    // Calculation logic
    var stateFees = {sole:{low:25,mid:50,high:100},llc:{low:50,mid:150,high:500},corp:{low:75,mid:200,high:800},nonprofit:{low:50,mid:150,high:400}}; var sf = (stateFees[entityType] || stateFees.llc)[state] || 150; var local = 50; var ein = needsEin === 'yes' ? 0 : 0; var ra = entityType === 'llc' || entityType === 'corp' ? 125 : 0; var total = sf + local + ein + ra; document.getElementById('stateFee').textContent = dollar(sf); document.getElementById('localLicense').textContent = dollar(local) + ' (typical)'; document.getElementById('totalStartup').textContent = dollar(total) + (ra > 0 ? ' (includes $125 registered agent)' : '');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['entityType', 'state', 'needsEin'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
