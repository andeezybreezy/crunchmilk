(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var careerField = document.getElementById('careerField').value;
    var taskType = document.getElementById('taskType').value;
    var income = parseFloat(document.getElementById('income').value) || 0;
    var experience = parseFloat(document.getElementById('experience').value) || 0;
    var yearsToRetire = parseFloat(document.getElementById('yearsToRetire').value) || 0;

    // Calculation logic
    var fieldRisk = {manual: 25, retail: 55, office: 65, data: 80, creative: 35, healthcare: 20, education: 30, tech: 40, legal: 50, management: 15}; var taskAdj = {routine: 1.4, mixed: 1.0, creative: 0.6, physical: 0.5, interpersonal: 0.4}; var baseRisk = fieldRisk[careerField] || 50; var adjRisk = Math.min(95, baseRisk * taskAdj[taskType]); var expProtection = Math.min(15, experience * 0.5); adjRisk = Math.max(5, adjRisk - expProtection); var riskLabel = adjRisk >= 70 ? 'HIGH' : adjRisk >= 40 ? 'MODERATE' : 'LOW'; var timeline = adjRisk >= 70 ? '3-7 years' : adjRisk >= 40 ? '7-15 years' : '15+ years'; var incomeRisk = income * yearsToRetire * (adjRisk / 100) * 0.5; var augmented = adjRisk >= 60 ? 'Role likely transforms — AI handles ' + fmt(adjRisk * 0.7, 0) + '% of current tasks' : 'Role adapts — AI assists with ' + fmt(adjRisk * 0.5, 0) + '% of tasks'; var advice = adjRisk >= 70 ? 'Urgent: Upskill in AI tools, pivot to supervisory/creative aspects' : adjRisk >= 40 ? 'Learn AI tools in your field, focus on interpersonal skills' : 'Stay current with AI developments, leverage AI to increase productivity'; document.getElementById('riskLevel').textContent = riskLabel + ' RISK'; document.getElementById('riskPct').textContent = fmt(adjRisk, 0) + '% of tasks automatable'; document.getElementById('timelineEst').textContent = timeline; document.getElementById('incomeAtRisk').textContent = dollar(incomeRisk) + ' over ' + yearsToRetire + ' years'; document.getElementById('augmentedRole').textContent = augmented; document.getElementById('adaptAdvice').textContent = advice;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['careerField', 'taskType', 'income', 'experience', 'yearsToRetire'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
