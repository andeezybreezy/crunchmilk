(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var age = parseFloat(document.getElementById('age').value) || 0;
    var breed = document.getElementById('breed').value;
    var monthlyPremium = parseFloat(document.getElementById('monthlyPremium').value) || 0;

    // Calculation logic
    var remainingYears = Math.max(12 - age, 1); var lifetimePremium = monthlyPremium * 12 * remainingYears; var avgAnnual = {'Low (mixed/hardy breed)': 800, 'Medium (average breed)': 1200, 'High (prone to issues)': 2000}; var expectedVet = (avgAnnual[breed] || 1200) * remainingYears; var verdict = expectedVet > lifetimePremium ? 'Likely worth it - expected vet costs exceed premiums' : 'May not be worth it - consider a vet savings fund instead';     document.getElementById('lifetimePremium').textContent = dollar(lifetimePremium);
    document.getElementById('expectedVet').textContent = dollar(expectedVet);
    document.getElementById('verdict').textContent = verdict;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['age', 'breed', 'monthlyPremium'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
