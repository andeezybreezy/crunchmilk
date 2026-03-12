(function() {
  'use strict';

  var unit = 'lbs';
  var sex = 'male';
  var lastCalc = null;

  var chartData = [
    ['0.02%', 'Slight relaxation, mild mood changes', 'Some loss of judgment'],
    ['0.05%', 'Lowered alertness, impaired judgment', 'Reduced coordination'],
    ['0.08%', 'Poor muscle coordination, impaired reasoning', 'Legal limit in US'],
    ['0.10%', 'Clear deterioration, slurred speech', 'Significant impairment'],
    ['0.15%', 'Far less muscle control, major balance issues', 'Severely impaired'],
    ['0.20%', 'Confusion, disorientation, nausea', 'Need assistance walking'],
    ['0.30%', 'Stupor, minimal comprehension', 'Loss of consciousness possible'],
    ['0.40%+', 'Life-threatening', 'Coma and death possible']
  ];

  // Unit toggle
  var toggleBtns = document.querySelectorAll('.unit-toggle[aria-label="Weight unit"] button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      unit = btn.dataset.unit;
    });
  });

  // Sex toggle
  var sexBtns = document.querySelectorAll('#sexToggle button');
  sexBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      sexBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      sex = btn.dataset.sex;
    });
  });

  function getStatus(bac) {
    if (bac <= 0) return 'Sober';
    if (bac < 0.02) return 'Minimal effect';
    if (bac < 0.05) return 'Mildly impaired';
    if (bac < 0.08) return 'Impaired — do not drive';
    if (bac < 0.15) return 'Legally intoxicated';
    if (bac < 0.30) return 'Severely impaired';
    return 'Dangerously intoxicated';
  }

  function calcBAC(drinks, weightGrams, r, hours) {
    var alcoholGrams = drinks * 14;
    var bac = (alcoholGrams / (weightGrams * r)) * 100 - (0.015 * hours);
    return Math.max(bac, 0);
  }

  function updateWhatIf() {
    if (!lastCalc) return;
    var toggle = document.getElementById('whatIfToggle');
    if (!toggle.checked) return;

    var extraDrinks = parseFloat(document.getElementById('wiDrinks').value) || 0;
    var newDrinks = lastCalc.drinks + extraDrinks;
    var newBAC = calcBAC(newDrinks, lastCalc.weightGrams, lastCalc.r, lastCalc.hours);
    var diff = newBAC - lastCalc.bac;

    document.getElementById('wiOriginal').textContent = lastCalc.bac.toFixed(3) + '%';
    document.getElementById('wiNew').textContent = newBAC.toFixed(3) + '%';
    document.getElementById('wiDelta').textContent = '+' + diff.toFixed(3) + '%';
    document.getElementById('wiDelta').style.color = newBAC >= 0.08 ? '#dc2626' : (newBAC >= 0.05 ? '#e65100' : '#059669');
    document.getElementById('wiStatus').textContent = getStatus(newBAC);
    document.getElementById('wiStatus').style.color = newBAC >= 0.08 ? '#dc2626' : 'var(--primary)';
  }

  var wiToggle = document.getElementById('whatIfToggle');
  if (wiToggle) {
    wiToggle.addEventListener('change', function() {
      document.getElementById('whatIfControls').style.display = this.checked ? 'block' : 'none';
      if (this.checked) updateWhatIf();
    });
  }
  var wiDrinks = document.getElementById('wiDrinks');
  if (wiDrinks) {
    wiDrinks.addEventListener('input', function() {
      document.getElementById('wiDrinksVal').textContent = this.value;
      updateWhatIf();
    });
  }

  function calculate() {
    var drinks = parseFloat(document.getElementById('drinks').value);
    var weight = parseFloat(document.getElementById('weight').value);
    var hours = parseFloat(document.getElementById('hours').value) || 0;
    if (isNaN(drinks) || isNaN(weight) || drinks < 0 || weight <= 0) return;

    var weightGrams = (unit === 'kg' ? weight : weight * 0.453592) * 1000;
    var r = sex === 'male' ? 0.68 : 0.55;
    var bac = calcBAC(drinks, weightGrams, r, hours);

    var hoursUntilSober = bac / 0.015;
    var soberHours = Math.floor(hoursUntilSober);
    var soberMinutes = Math.round((hoursUntilSober - soberHours) * 60);

    document.getElementById('bacValue').textContent = bac.toFixed(3) + '%';
    document.getElementById('bacStatus').textContent = getStatus(bac);

    if (bac <= 0) {
      document.getElementById('soberTime').textContent = 'You are sober';
    } else {
      document.getElementById('soberTime').textContent = soberHours + 'h ' + soberMinutes + 'min';
    }

    var tipEl = document.getElementById('resultTip');
    if (bac >= 0.08) {
      tipEl.textContent = 'Warning: This BAC is at or above the legal driving limit. Do not drive.';
    } else if (bac >= 0.04) {
      tipEl.textContent = 'Caution: Even below the legal limit, impairment begins at 0.02% BAC. Consider not driving.';
    } else {
      tipEl.textContent = 'This is an estimate only. Individual results vary. When in doubt, do not drive.';
    }

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    lastCalc = { drinks: drinks, weightGrams: weightGrams, r: r, hours: hours, bac: bac };
    document.getElementById('whatIfSection').style.display = 'block';
    updateWhatIf();
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('drinks').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

  // Render chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td>';
      chartBody.appendChild(tr);
    });
  }

})();
