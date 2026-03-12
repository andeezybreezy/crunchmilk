(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentGrade = parseFloat(document.getElementById('currentGrade').value) || 0;
    var targetGrade = parseFloat(document.getElementById('targetGrade').value) || 0;
    var finalWeight = parseFloat(document.getElementById('finalWeight').value) || 0;

    // Calculation logic
    var cw = (100 - finalWeight) / 100; var fw = finalWeight / 100; var needed = (targetGrade - currentGrade * cw) / fw; var if100 = currentGrade * cw + 100 * fw; var if80 = currentGrade * cw + 80 * fw; var feas = needed <= 0 ? 'Already achieved!' : needed <= 80 ? 'Very achievable' : needed <= 100 ? 'Achievable with solid study' : needed <= 110 ? 'Difficult — need extra credit' : 'Not possible without extra credit'; document.getElementById('neededScore').textContent = needed <= 0 ? 'Already there!' : fmt(needed, 1) + '%'; document.getElementById('feasibility').textContent = feas; document.getElementById('ifYouGet100').textContent = fmt(if100, 1) + '%'; document.getElementById('ifYouGet80').textContent = fmt(if80, 1) + '%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentGrade', 'targetGrade', 'finalWeight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
