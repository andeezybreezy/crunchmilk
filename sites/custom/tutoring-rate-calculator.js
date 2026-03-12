(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var subject = document.getElementById('subject').value;
    var experience = parseFloat(document.getElementById('experience').value) || 0;
    var hoursWeek = parseFloat(document.getElementById('hoursWeek').value) || 0;

    // Calculation logic
    var baseRates = {'Elementary': 25, 'Middle School': 30, 'High School': 40, 'College': 50, 'Graduate': 65}; var base = baseRates[subject] || 35; var hourlyRate = base + (experience * 3); var weeklyIncome = hourlyRate * hoursWeek; var monthlyIncome = weeklyIncome * 4.33;     document.getElementById('hourlyRate').textContent = dollar(hourlyRate);
    document.getElementById('weeklyIncome').textContent = dollar(weeklyIncome);
    document.getElementById('monthlyIncome').textContent = dollar(monthlyIncome);

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
