(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var drinks = parseFloat(document.getElementById('drinks').value) || 0;
    var bodyWeight = parseFloat(document.getElementById('bodyWeight').value) || 0;
    var gender = document.getElementById('gender').value;
    var hoursAgo = parseFloat(document.getElementById('hoursAgo').value) || 0;
    var hoursSpan = parseFloat(document.getElementById('hoursSpan').value) || 0;

    // Calculation logic
    var weightKg = bodyWeight * 0.4536;
    var r = gender === 'male' ? 0.68 : 0.55;
    var gramsAlcohol = drinks * 14;
    var peakBac = (gramsAlcohol / (weightKg * r * 10)) - (0.015 * hoursSpan * 0.5);
    peakBac = Math.max(0, peakBac);
    var eliminationRate = 0.015;
    var elapsed = Math.max(0, hoursAgo - hoursSpan);
    var currentBac = Math.max(0, peakBac - (eliminationRate * elapsed));
    var timeToZero = currentBac / eliminationRate;
    var timeToLegal = Math.max(0, (currentBac - 0.08) / eliminationRate);
    document.getElementById('peakBAC').textContent = peakBac.toFixed(3) + '%';
    document.getElementById('currentBAC').textContent = currentBac.toFixed(3) + '%';
    document.getElementById('soberTime').textContent = currentBac <= 0 ? 'Already at 0.00%' : fmt(timeToZero, 1) + ' hours from now';
    document.getElementById('legalTime').textContent = currentBac <= 0.08 ? 'Already below 0.08%' : fmt(timeToLegal, 1) + ' hours from now';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['drinks', 'bodyWeight', 'gender', 'hoursAgo', 'hoursSpan'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
