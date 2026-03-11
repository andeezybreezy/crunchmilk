(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var subject = document.getElementById('subject').value;
    var experience = parseFloat(document.getElementById('experience').value) || 0;
    var hoursWeek = parseFloat(document.getElementById('hoursWeek').value) || 0;

    // Calculation logic
    var baseRates = {'Elementary': 25, 'Middle School': 30, 'High School': 40, 'College': 50, 'Graduate': 65}; var base = baseRates[subject] || 35; var hourlyRate = base + (experience * 3); var weeklyIncome = hourlyRate * hoursWeek; var monthlyIncome = weeklyIncome * 4.33; return {hourlyRate: dollar(hourlyRate), weeklyIncome: dollar(weeklyIncome), monthlyIncome: dollar(monthlyIncome)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['subject', 'experience', 'hoursWeek'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
