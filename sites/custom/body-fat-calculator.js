(function() {
  'use strict';

  let gender = 'male';
  let system = 'imperial';

  // Gender toggle
  document.querySelectorAll('[data-gender]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-gender]').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      gender = btn.dataset.gender;
      var show = gender === 'female';
      document.getElementById('hipGroupIn').style.display = show ? '' : 'none';
      document.getElementById('hipGroupCm').style.display = show ? '' : 'none';
    });
  });

  // Unit system toggle
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

  function getCategory(bf, isMale) {
    if (isMale) {
      if (bf <= 5) return 'Essential Fat';
      if (bf <= 13) return 'Athlete';
      if (bf <= 17) return 'Fitness';
      if (bf <= 24) return 'Average';
      return 'Obese';
    } else {
      if (bf <= 13) return 'Essential Fat';
      if (bf <= 20) return 'Athlete';
      if (bf <= 24) return 'Fitness';
      if (bf <= 31) return 'Average';
      return 'Obese';
    }
  }

  document.getElementById('calcBtn').addEventListener('click', function() {
    var heightCm, weightLbs, weightKg, neckCm, waistCm, hipCm;

    if (system === 'imperial') {
      var ft = parseFloat(document.getElementById('heightFt').value);
      var inch = parseFloat(document.getElementById('heightIn').value) || 0;
      heightCm = (ft * 12 + inch) * 2.54;
      weightLbs = parseFloat(document.getElementById('weightLbs').value);
      weightKg = weightLbs * 0.453592;
      neckCm = parseFloat(document.getElementById('neckIn').value) * 2.54;
      waistCm = parseFloat(document.getElementById('waistIn').value) * 2.54;
      hipCm = parseFloat(document.getElementById('hipIn').value) * 2.54;
    } else {
      heightCm = parseFloat(document.getElementById('heightCm').value);
      weightKg = parseFloat(document.getElementById('weightKg').value);
      weightLbs = weightKg / 0.453592;
      neckCm = parseFloat(document.getElementById('neckCm').value);
      waistCm = parseFloat(document.getElementById('waistCm').value);
      hipCm = parseFloat(document.getElementById('hipCm').value);
    }

    if (!heightCm || !weightKg || !neckCm || !waistCm || heightCm <= 0) {
      alert('Please fill in all required fields.');
      return;
    }
    if (gender === 'female' && (!hipCm || hipCm <= 0)) {
      alert('Hip circumference is required for women.');
      return;
    }

    var bf;
    if (gender === 'male') {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }

    bf = Math.max(bf, 1);
    var fatMassKg = weightKg * bf / 100;
    var leanMassKg = weightKg - fatMassKg;

    var unitLabel = system === 'imperial' ? 'lbs' : 'kg';
    var fatDisplay = system === 'imperial' ? (fatMassKg / 0.453592).toFixed(1) : fatMassKg.toFixed(1);
    var leanDisplay = system === 'imperial' ? (leanMassKg / 0.453592).toFixed(1) : leanMassKg.toFixed(1);

    document.getElementById('bfPercent').textContent = bf.toFixed(1) + '%';
    document.getElementById('bfCategory').textContent = getCategory(bf, gender === 'male');
    document.getElementById('fatMass').textContent = fatDisplay + ' ' + unitLabel;
    document.getElementById('leanMass').textContent = leanDisplay + ' ' + unitLabel;
    document.getElementById('result').style.display = '';
  });
})();
