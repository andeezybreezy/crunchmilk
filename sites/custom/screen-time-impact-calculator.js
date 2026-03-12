(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalHours = parseFloat(document.getElementById('totalHours').value) || 0;
    var socialMedia = parseFloat(document.getElementById('socialMedia').value) || 0;
    var beforeBed = parseFloat(document.getElementById('beforeBed').value) || 0;
    var age = parseFloat(document.getElementById('age').value) || 0;

    // Calculation logic
    var riskScore = 0; riskScore += totalHours > 8 ? 3 : totalHours > 5 ? 2 : totalHours > 3 ? 1 : 0; riskScore += socialMedia > 3 ? 3 : socialMedia > 2 ? 2 : socialMedia > 1 ? 1 : 0; riskScore += beforeBed > 60 ? 2 : beforeBed > 30 ? 1 : 0; var riskLevel = riskScore >= 6 ? 'High' : riskScore >= 3 ? 'Moderate' : 'Low'; var sleepImpact = beforeBed > 60 ? 'Significant - blue light delays melatonin by 30+ min' : beforeBed > 30 ? 'Moderate - consider blue light filter' : 'Minimal'; var recommendation = riskScore >= 6 ? 'Reduce social media by 1 hr, no screens 1 hr before bed' : riskScore >= 3 ? 'Set screen time limits, use night mode after sunset' : 'Healthy screen habits - maintain current patterns';     document.getElementById('riskLevel').textContent = riskLevel;
    document.getElementById('sleepImpact').textContent = sleepImpact;
    document.getElementById('recommendation').textContent = recommendation;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalHours', 'socialMedia', 'beforeBed', 'age'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
