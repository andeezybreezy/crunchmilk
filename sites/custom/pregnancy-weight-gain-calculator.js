(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var preWeight = parseFloat(document.getElementById('preWeight').value) || 0;
    var height = parseFloat(document.getElementById('height').value) || 0;
    var currentWeek = parseFloat(document.getElementById('currentWeek').value) || 0;

    // Calculation logic
    var bmi = (preWeight / (height * height)) * 703; var cat = bmi < 18.5 ? 'under' : bmi < 25 ? 'normal' : bmi < 30 ? 'over' : 'obese'; var ranges = {under:[28,40,1.1], normal:[25,35,1.0], over:[15,25,0.6], obese:[11,20,0.5]}; var r = ranges[cat]; var midGain = (r[0] + r[1]) / 2; var weeklyRate2 = r[2]; var expectedNow = currentWeek <= 13 ? currentWeek * 0.2 : 2.5 + (currentWeek - 13) * weeklyRate2; document.getElementById('preBmi').textContent = fmt(bmi, 1) + ' (' + cat.replace('under','underweight').replace('normal','normal weight').replace('over','overweight') + ')'; document.getElementById('totalRec').textContent = r[0] + '-' + r[1] + ' lbs'; document.getElementById('gainToDate').textContent = fmt(Math.min(expectedNow, midGain), 1) + ' lbs (expected at week ' + currentWeek + ')'; document.getElementById('weeklyRate').textContent = fmt(weeklyRate2, 1) + ' lbs/week';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['preWeight', 'height', 'currentWeek'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
