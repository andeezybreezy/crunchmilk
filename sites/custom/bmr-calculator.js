(function() {
  'use strict';

  var sex = 'male';
  var weightUnit = 'lbs';
  var heightUnit = 'imperial';

  var chartData = [
    ['18-25', '1,700-1,900', '1,400-1,600'],
    ['26-35', '1,600-1,800', '1,350-1,550'],
    ['36-45', '1,550-1,750', '1,300-1,500'],
    ['46-55', '1,500-1,700', '1,250-1,450'],
    ['56-65', '1,400-1,600', '1,200-1,400'],
    ['66-75', '1,350-1,550', '1,150-1,350'],
    ['76+', '1,250-1,450', '1,100-1,300']
  ];

  // Sex toggle
  var sexBtns = document.querySelectorAll('#sexToggle button');
  sexBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      sexBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      sex = btn.dataset.sex;
    });
  });

  // Weight toggle
  var weightBtns = document.querySelectorAll('#weightToggle button');
  weightBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      weightBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      weightUnit = btn.dataset.unit;
    });
  });

  // Height toggle
  function setHeightUnit(u) {
    heightUnit = u;
    document.getElementById('imperialHeight').style.display = u === 'imperial' ? '' : 'none';
    document.getElementById('metricHeight').style.display = u === 'metric' ? '' : 'none';
  }

  document.querySelectorAll('#heightToggle button, #heightToggle2 button').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#heightToggle button, #heightToggle2 button').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      document.querySelectorAll('[data-hunit="' + btn.dataset.hunit + '"]').forEach(function(b) {
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
      });
      setHeightUnit(btn.dataset.hunit);
    });
  });

  function calculate() {
    var age = parseFloat(document.getElementById('age').value);
    var w = parseFloat(document.getElementById('weight').value);
    if (isNaN(age) || isNaN(w) || age <= 0 || w <= 0) return;

    var weightKg = weightUnit === 'lbs' ? w * 0.453592 : w;

    var heightCm;
    if (heightUnit === 'imperial') {
      var ft = parseFloat(document.getElementById('heightFt').value) || 0;
      var inc = parseFloat(document.getElementById('heightIn').value) || 0;
      heightCm = (ft * 12 + inc) * 2.54;
    } else {
      heightCm = parseFloat(document.getElementById('heightCm').value);
    }
    if (isNaN(heightCm) || heightCm <= 0) return;

    // Mifflin-St Jeor equation
    var bmr;
    if (sex === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    document.getElementById('bmrValue').textContent = Math.round(bmr) + ' cal/day';
    document.getElementById('calSedentary').textContent = Math.round(bmr * 1.2) + ' cal';
    document.getElementById('calLight').textContent = Math.round(bmr * 1.375) + ' cal';
    document.getElementById('calModerate').textContent = Math.round(bmr * 1.55) + ' cal';
    document.getElementById('calActive').textContent = Math.round(bmr * 1.725) + ' cal';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('age').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  document.getElementById('weight').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

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
