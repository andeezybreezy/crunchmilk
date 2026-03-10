(function() {
  'use strict';

  // Medication data: { dosePerKg, maxDoseMg, frequency, maxDosesPerDay, formulations: [[label, mg_per_mL]] }
  var meds = {
    acetaminophen: {
      dosePerKg: 15,
      maxDoseMg: 1000,
      frequency: 'Every 4–6 hours',
      maxDosesPerDay: 5,
      formulations: [
        ['Infant drops (160 mg / 5 mL)', 32],
        ['Children\'s liquid (160 mg / 5 mL)', 32],
        ['Children\'s chewable (80 mg tablet)', 0],
        ['Children\'s chewable (160 mg tablet)', 0],
        ['Junior strength (325 mg tablet)', 0]
      ]
    },
    ibuprofen: {
      dosePerKg: 10,
      maxDoseMg: 600,
      frequency: 'Every 6–8 hours',
      maxDosesPerDay: 4,
      formulations: [
        ['Infant drops (50 mg / 1.25 mL)', 40],
        ['Children\'s liquid (100 mg / 5 mL)', 20],
        ['Children\'s chewable (50 mg tablet)', 0],
        ['Children\'s chewable (100 mg tablet)', 0],
        ['Junior strength (200 mg tablet)', 0]
      ]
    },
    diphenhydramine: {
      dosePerKg: 1.25,
      maxDoseMg: 50,
      frequency: 'Every 6–8 hours',
      maxDosesPerDay: 4,
      formulations: [
        ['Children\'s liquid (12.5 mg / 5 mL)', 2.5],
        ['Children\'s chewable (12.5 mg tablet)', 0],
        ['Capsule (25 mg)', 0]
      ]
    }
  };

  var weightUnit = 'lbs';

  // Unit toggle
  var toggleBtns = document.querySelectorAll('.unit-toggle button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      weightUnit = btn.dataset.unit;
    });
  });

  var medSelect = document.getElementById('medication');
  var formSelect = document.getElementById('formulation');

  function updateFormulations() {
    var med = meds[medSelect.value];
    formSelect.innerHTML = '';
    med.formulations.forEach(function(f, i) {
      var o = document.createElement('option');
      o.value = i;
      o.textContent = f[0];
      formSelect.appendChild(o);
    });
  }

  medSelect.addEventListener('change', updateFormulations);
  updateFormulations();

  function calculate() {
    var weight = parseFloat(document.getElementById('childWeight').value);
    var medKey = medSelect.value;
    var formIdx = parseInt(formSelect.value, 10);

    if (isNaN(weight) || weight <= 0) return;

    var med = meds[medKey];
    var formulation = med.formulations[formIdx];
    var mgPerMl = formulation[1];

    var weightKg = weightUnit === 'lbs' ? weight / 2.205 : weight;
    var doseMg = weightKg * med.dosePerKg;
    doseMg = Math.min(doseMg, med.maxDoseMg);
    doseMg = Math.round(doseMg * 10) / 10;

    var doseMl = '';
    if (mgPerMl > 0) {
      var ml = doseMg / mgPerMl;
      doseMl = ml.toFixed(1) + ' mL';
    } else {
      doseMl = 'N/A (tablet form)';
    }

    var maxDaily = med.maxDoseMg * med.maxDosesPerDay;
    maxDaily = Math.min(maxDaily, med.maxDoseMg === 1000 ? 4000 : med.maxDoseMg * med.maxDosesPerDay);

    document.getElementById('doseMg').textContent = doseMg + ' mg';
    document.getElementById('doseMl').textContent = doseMl;
    document.getElementById('frequency').textContent = med.frequency + ' (max ' + med.maxDosesPerDay + ' doses/day)';
    document.getElementById('maxDaily').textContent = (doseMg * med.maxDosesPerDay).toFixed(0) + ' mg (' + med.maxDosesPerDay + ' doses × ' + doseMg + ' mg)';

    var tip = 'Based on ' + med.dosePerKg + ' mg/kg for a ' + weightKg.toFixed(1) + ' kg child. ';
    if (doseMg >= med.maxDoseMg) {
      tip += 'Dose capped at maximum single dose of ' + med.maxDoseMg + ' mg. ';
    }
    tip += 'Always verify with a pharmacist or pediatrician.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
