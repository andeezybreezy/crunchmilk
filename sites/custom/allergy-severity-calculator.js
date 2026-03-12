(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sneezing = parseFloat(document.getElementById('sneezing').value) || 0;
    var congestion = parseFloat(document.getElementById('congestion').value) || 0;
    var runnyNose = parseFloat(document.getElementById('runnyNose').value) || 0;
    var itchyEyes = parseFloat(document.getElementById('itchyEyes').value) || 0;
    var itchyThroat = parseFloat(document.getElementById('itchyThroat').value) || 0;
    var sleepImpact = parseFloat(document.getElementById('sleepImpact').value) || 0;
    var activityImpact = parseFloat(document.getElementById('activityImpact').value) || 0;

    // Calculation logic
    var tnss = sneezing + congestion + runnyNose + itchyEyes + itchyThroat;
    var qol = sleepImpact + activityImpact;
    var total = tnss + qol;
    var maxScore = 21;
    var pct = (total / maxScore) * 100;
    var severity, rec;
    if (total <= 5) { severity = 'Mild'; rec = 'Over-the-counter antihistamine may be sufficient. Try nasal saline rinses.'; }
    else if (total <= 10) { severity = 'Moderate'; rec = 'Consider daily antihistamine + nasal corticosteroid spray. Minimize allergen exposure.'; }
    else if (total <= 15) { severity = 'Moderate-Severe'; rec = 'See an allergist. May benefit from prescription medications or immunotherapy.'; }
    else { severity = 'Severe'; rec = 'Consult an allergist promptly. Immunotherapy (allergy shots/drops) may be recommended.'; }
    var qolText = qol <= 1 ? 'Minimal impact' : qol <= 3 ? 'Moderate impact' : 'Significant impact on daily life';
    document.getElementById('totalScore').textContent = total + ' / ' + maxScore + ' (' + fmt(pct, 0) + '%)';
    document.getElementById('severity').textContent = severity;
    document.getElementById('qualityImpact').textContent = qolText;
    document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sneezing', 'congestion', 'runnyNose', 'itchyEyes', 'itchyThroat', 'sleepImpact', 'activityImpact'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
