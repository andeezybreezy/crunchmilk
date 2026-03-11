(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var interest = parseFloat(document.getElementById('interest').value) || 0;
    var hopeless = parseFloat(document.getElementById('hopeless').value) || 0;
    var sleep = parseFloat(document.getElementById('sleep').value) || 0;
    var energy = parseFloat(document.getElementById('energy').value) || 0;
    var concentration = parseFloat(document.getElementById('concentration').value) || 0;

    // Calculation logic
    var total = interest + hopeless + sleep + energy + concentration; var sev = total <= 4 ? 'Minimal Depression' : total <= 9 ? 'Mild Depression' : total <= 14 ? 'Moderate Depression' : 'Severe Depression'; var rec = total >= 10 ? 'Please speak with a healthcare provider. Effective treatments exist. Call 988 Suicide & Crisis Lifeline if in crisis.' : total >= 5 ? 'Mild symptoms are common. Stay connected with others, exercise regularly, and monitor symptoms. Seek help if worsening.' : 'Your score suggests minimal depression. Maintain healthy routines and social connections.'; document.getElementById('totalScore').textContent = total + ' / 15'; document.getElementById('severity').textContent = sev; document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['interest', 'hopeless', 'sleep', 'energy', 'concentration'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
