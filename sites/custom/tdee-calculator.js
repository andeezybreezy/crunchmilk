(function() {
  'use strict';

  var gender = 'male';
  var system = 'imperial';

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

  document.querySelectorAll('[data-system]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-system]').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      system = btn.dataset.system;
      document.getElementById('imperialInputs').style.display = system === 'imperial' ? '' : 'none';
      document.getElementById('metricInputs').style.display = system === 'metric' ? '' : 'none';
    });
  });

  document.getElementById('calcBtn').addEventListener('click', function() {
    var age = parseFloat(document.getElementById('age').value);
    var heightCm, weightKg;

    if (system === 'imperial') {
      var ft = parseFloat(document.getElementById('heightFt').value) || 0;
      var inch = parseFloat(document.getElementById('heightIn').value) || 0;
      heightCm = (ft * 12 + inch) * 2.54;
      weightKg = parseFloat(document.getElementById('weightLbs').value) * 0.453592;
    } else {
      heightCm = parseFloat(document.getElementById('heightCm').value);
      weightKg = parseFloat(document.getElementById('weightKg').value);
    }

    if (!age || !heightCm || !weightKg) {
      alert('Please fill in all fields.');
      return;
    }

    var bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr += (gender === 'male') ? 5 : -161;

    var multiplier = parseFloat(document.getElementById('activity').value);
    var tdee = Math.round(bmr * multiplier);
    bmr = Math.round(bmr);

    document.getElementById('bmrVal').textContent = bmr.toLocaleString() + ' cal';
    document.getElementById('tdeeVal').textContent = tdee.toLocaleString() + ' cal';
    document.getElementById('cut500').textContent = Math.round(tdee - 500).toLocaleString() + ' cal';
    document.getElementById('cut250').textContent = Math.round(tdee - 250).toLocaleString() + ' cal';
    document.getElementById('gain250').textContent = Math.round(tdee + 250).toLocaleString() + ' cal';
    document.getElementById('gain500').textContent = Math.round(tdee + 500).toLocaleString() + ' cal';
    document.getElementById('result').style.display = '';
  });
})();
