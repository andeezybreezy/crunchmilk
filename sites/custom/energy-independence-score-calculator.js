(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var country = document.getElementById('country').value;

    // Calculation logic
    var data = {us: {prod: 20.2, cons: 20.0, renew: 13, score: 88}, china: {prod: 4.1, cons: 15.4, renew: 16, score: 38}, eu: {prod: 1.0, cons: 10.5, renew: 23, score: 32}, japan: {prod: 0.02, cons: 3.2, renew: 22, score: 18}, india: {prod: 0.8, cons: 5.1, renew: 11, score: 28}, uk: {prod: 0.7, cons: 1.4, renew: 25, score: 55}, russia: {prod: 10.8, cons: 3.5, renew: 4, score: 95}, saudi: {prod: 10.5, cons: 3.7, renew: 1, score: 98}, brazil: {prod: 3.7, cons: 3.0, renew: 28, score: 82}, canada: {prod: 5.6, cons: 2.5, renew: 18, score: 92}}; var d = data[country]; var importDep = Math.max(0, ((d.cons - d.prod) / d.cons * 100)); var vuln = d.score > 80 ? 'Low' : d.score > 50 ? 'Moderate' : d.score > 30 ? 'High' : 'Very High';     document.getElementById('score').textContent = d.score + '/100';
    document.getElementById('production').textContent = d.prod + ' million bpd';
    document.getElementById('consumption').textContent = d.cons + ' million bpd';
    document.getElementById('importDep').textContent = importDep.toFixed(0) + '%';
    document.getElementById('renewablePct').textContent = d.renew + '%';
    document.getElementById('vulnerability').textContent = vuln;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['country'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
