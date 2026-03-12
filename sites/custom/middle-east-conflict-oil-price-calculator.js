(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var scenario = document.getElementById('scenario').value;
    var currentOil = parseFloat(document.getElementById('currentOil').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;

    // Calculation logic
    var scenarios = {tensions: {mult: 1.15, supply: '1-2 million bpd', dur: 'Weeks to months'}, proxy: {mult: 1.30, supply: '2-3 million bpd', dur: 'Months'}, limited: {mult: 1.50, supply: '3-5 million bpd', dur: '3-6 months'}, regional: {mult: 2.0, supply: '5-8 million bpd', dur: '6-18 months'}, full: {mult: 3.0, supply: '15-20 million bpd', dur: '1-3 years'}}; var s = scenarios[scenario]; var newOil = currentOil * s.mult; var gasMultiplier = 1 + (s.mult - 1) * 0.6; var newGas = gasPrice * gasMultiplier;     document.getElementById('projectedOil').textContent = '$' + newOil.toFixed(0) + '/barrel';
    document.getElementById('oilChange').textContent = '+' + ((s.mult - 1) * 100).toFixed(0) + '%';
    document.getElementById('projectedGas').textContent = '$' + newGas.toFixed(2) + '/gal';
    document.getElementById('gasChange').textContent = '+' + ((gasMultiplier - 1) * 100).toFixed(0) + '%';
    document.getElementById('supplyLoss').textContent = s.supply;
    document.getElementById('duration').textContent = s.dur;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['scenario', 'currentOil', 'gasPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
