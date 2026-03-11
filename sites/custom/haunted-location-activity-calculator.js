(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var age = parseFloat(document.getElementById('age').value) || 0;
    var deaths = parseFloat(document.getElementById('deaths').value) || 0;
    var reports = parseFloat(document.getElementById('reports').value) || 0;
    var nearCemetery = document.getElementById('nearCemetery').value;

    // Calculation logic
    var score = Math.min(age * 0.1, 15) + deaths * 10 + reports * 5 + (nearCemetery === 'Yes' ? 15 : 0); score = Math.min(score, 100); var category = score >= 60 ? 'High Activity' : score >= 35 ? 'Moderate Activity' : score >= 15 ? 'Low Activity' : 'Minimal';     document.getElementById('riskScore').textContent = fmt(score,0);
    document.getElementById('category').textContent = category;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['age', 'deaths', 'reports', 'nearCemetery'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
