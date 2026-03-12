(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sneezing = parseFloat(document.getElementById('sneezing').value) || 0;
    var congestion = parseFloat(document.getElementById('congestion').value) || 0;
    var eyeItch = parseFloat(document.getElementById('eyeItch').value) || 0;
    var interference = parseFloat(document.getElementById('interference').value) || 0;

    // Calculation logic
    var sneezeScore = Math.min(sneezing, 10); var score = sneezeScore + congestion + eyeItch + interference; var severity = score >= 30 ? 'Severe' : score >= 20 ? 'Moderate-Severe' : score >= 12 ? 'Moderate' : score >= 5 ? 'Mild' : 'Minimal'; var action = score >= 20 ? 'See allergist, consider immunotherapy' : score >= 12 ? 'Daily antihistamine + nasal spray' : score >= 5 ? 'As-needed antihistamine' : 'Monitor symptoms';     document.getElementById('score').textContent = fmt(score,0);
    document.getElementById('severity').textContent = severity;
    document.getElementById('action').textContent = action;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sneezing', 'congestion', 'eyeItch', 'interference'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
