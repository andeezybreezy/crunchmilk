(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var agency = document.getElementById('agency').value;
    var complexity = document.getElementById('complexity').value;

    // Calculation logic
    var times = {federal:{simple:20,complex:90,expedited:10},state:{simple:10,complex:30,expedited:5},local:{simple:7,complex:21,expedited:3}}; var t = (times[agency] || times.federal)[complexity] || 20; var legal = agency === 'federal' ? 20 : agency === 'state' ? '10-15' : '5-10'; document.getElementById('estDays').textContent = t + ' business days (typical)'; document.getElementById('deadline').textContent = legal + ' business days (statutory)'; document.getElementById('appealWindow').textContent = agency === 'federal' ? '90 days to appeal' : 'Varies by jurisdiction';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['agency', 'complexity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
