(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var nervous = parseFloat(document.getElementById('nervous').value) || 0;
    var worry = parseFloat(document.getElementById('worry').value) || 0;
    var restless = parseFloat(document.getElementById('restless').value) || 0;
    var irritable = parseFloat(document.getElementById('irritable').value) || 0;
    var afraid = parseFloat(document.getElementById('afraid').value) || 0;

    // Calculation logic
    var total = nervous + worry + restless + irritable + afraid; var sev = total <= 4 ? 'Minimal Anxiety' : total <= 9 ? 'Mild Anxiety' : total <= 14 ? 'Moderate Anxiety' : 'Severe Anxiety'; var rec = total >= 10 ? 'Consider speaking with a mental health professional. This score suggests clinical-level anxiety.' : total >= 5 ? 'Mild anxiety is common. Try mindfulness, exercise, and stress management. Seek help if symptoms worsen.' : 'Your anxiety level appears minimal. Continue healthy coping strategies.'; document.getElementById('totalScore').textContent = total + ' / 15'; document.getElementById('severity').textContent = sev; document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['nervous', 'worry', 'restless', 'irritable', 'afraid'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
