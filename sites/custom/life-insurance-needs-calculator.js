(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var income = parseFloat(document.getElementById('income').value) || 0;
    var yearsReplace = parseFloat(document.getElementById('yearsReplace').value) || 0;
    var debt = parseFloat(document.getElementById('debt').value) || 0;
    var education = parseFloat(document.getElementById('education').value) || 0;
    var existing = parseFloat(document.getElementById('existing').value) || 0;

    // Calculation logic
    var incomeReplace = income * yearsReplace; var totalNeed = incomeReplace + debt + education; var gap = Math.max(totalNeed - existing, 0); return {totalNeed: dollar(totalNeed), gap: dollar(gap)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['income', 'yearsReplace', 'debt', 'education', 'existing'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
