(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var experience = document.getElementById('experience').value;
    var instrument = document.getElementById('instrument').value;
    var lessonLength = document.getElementById('lessonLength').value;
    var location = document.getElementById('location').value;
    var costOfLiving = document.getElementById('costOfLiving').value;

    // Calculation logic
    var baseRates = {'Beginner (0-2 years)': 35, 'Intermediate (3-7 years)': 55, 'Advanced (8-15 years)': 75, 'Master/Degree (15+ years)': 100}; var lengthMult = {'30': 0.6, '45': 0.85, '60': 1, '90': 1.4}; var locationMult = {'In-Home (student)': 1.15, 'Your Studio': 1, 'Online': 0.9, 'Music School': 0.75}; var colMult = {'Low': 0.75, 'Medium': 1, 'High': 1.35, 'Very High (NYC, SF)': 1.7}; var base = baseRates[experience] || 55; var rate = base * (lengthMult[lessonLength] || 1) * (locationMult[location] || 1) * (colMult[costOfLiving] || 1); var hourlyEquivalent = rate / (parseInt(lessonLength) / 60); var monthlyIncome = rate * 20 * 4.33; var annualIncome = rate * 20 * 44; return {suggestedRate: dollar(rate), hourlyEquivalent: dollar(hourlyEquivalent), monthlyIncome: dollar(monthlyIncome), annualIncome: dollar(annualIncome)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['experience', 'instrument', 'lessonLength', 'location', 'costOfLiving'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
