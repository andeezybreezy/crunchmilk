(function() {
  'use strict';

  var mode = 'manual';
  var gender = 'male';

  var diets = {
    balanced:    { carb: 0.40, protein: 0.30, fat: 0.30 },
    lowcarb:     { carb: 0.25, protein: 0.45, fat: 0.30 },
    keto:        { carb: 0.05, protein: 0.25, fat: 0.70 },
    highprotein: { carb: 0.35, protein: 0.40, fat: 0.25 }
  };

  document.querySelectorAll('[data-mode]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-mode]').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      mode = btn.dataset.mode;
      document.getElementById('manualInput').style.display = mode === 'manual' ? '' : 'none';
      document.getElementById('calcInputs').style.display = mode === 'calculate' ? '' : 'none';
    });
  });

  document.querySelectorAll('[data-gender]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-gender]').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      gender = btn.dataset.gender;
    });
  });

  document.getElementById('calcBtn').addEventListener('click', function() {
    var tdee;

    if (mode === 'manual') {
      tdee = parseFloat(document.getElementById('tdeeInput').value);
      if (!tdee) { alert('Please enter your daily calories.'); return; }
    } else {
      var age = parseFloat(document.getElementById('age').value);
      var ft = parseFloat(document.getElementById('heightFt').value) || 0;
      var inch = parseFloat(document.getElementById('heightIn').value) || 0;
      var weightLbs = parseFloat(document.getElementById('weightLbs').value);
      if (!age || !weightLbs || !ft) { alert('Please fill in all fields.'); return; }
      var heightCm = (ft * 12 + inch) * 2.54;
      var weightKg = weightLbs * 0.453592;
      var bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === 'male' ? 5 : -161);
      var mult = parseFloat(document.getElementById('activityCalc').value);
      tdee = bmr * mult;
    }

    var goalOffset = parseFloat(document.getElementById('goal').value);
    var calories = Math.round(tdee + goalOffset);
    var d = diets[document.getElementById('diet').value];

    var proteinG = Math.round((calories * d.protein) / 4);
    var fatG = Math.round((calories * d.fat) / 9);
    var carbG = Math.round((calories * d.carb) / 4);

    document.getElementById('calVal').textContent = calories.toLocaleString() + ' cal';
    document.getElementById('proteinVal').textContent = proteinG + 'g (' + Math.round(d.protein * 100) + '%)';
    document.getElementById('fatVal').textContent = fatG + 'g (' + Math.round(d.fat * 100) + '%)';
    document.getElementById('carbVal').textContent = carbG + 'g (' + Math.round(d.carb * 100) + '%)';
    document.getElementById('result').style.display = '';
  });
})();
