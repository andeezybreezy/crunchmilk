(function() {
  'use strict';

  // Official Wilks coefficients
  var maleCoeffs = {
    a: -216.0475144,
    b: 16.2606339,
    c: -0.002388645,
    d: -0.00113732,
    e: 7.01863E-06,
    f: -1.291E-08
  };
  var femaleCoeffs = {
    a: 594.31747775582,
    b: -27.23842536447,
    c: 0.82112226871,
    d: -0.00930733913,
    e: 4.731582E-05,
    f: -9.054E-08
  };

  var chartData = [
    ['Beginner', 'Under 200', 'Under 150'],
    ['Novice', '200\u2013300', '150\u2013250'],
    ['Intermediate', '300\u2013400', '250\u2013350'],
    ['Advanced', '400\u2013450', '350\u2013400'],
    ['Elite', '450\u2013500', '400\u2013450'],
    ['World Class', '500+', '450+']
  ];

  var unit = 'lbs';
  var sex = 'male';

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
      document.getElementById('liftUnitLabel').textContent = unit;
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

  function wilksCoefficient(bwKg, coeffs) {
    var x = bwKg;
    var denom = coeffs.a + coeffs.b * x + coeffs.c * Math.pow(x, 2) + coeffs.d * Math.pow(x, 3) + coeffs.e * Math.pow(x, 4) + coeffs.f * Math.pow(x, 5);
    return 500 / denom;
  }

  function getRating(score, isMale) {
    if (isMale) {
      if (score >= 500) return 'World Class';
      if (score >= 450) return 'Elite';
      if (score >= 400) return 'Advanced';
      if (score >= 300) return 'Intermediate';
      if (score >= 200) return 'Novice';
      return 'Beginner';
    } else {
      if (score >= 450) return 'World Class';
      if (score >= 400) return 'Elite';
      if (score >= 350) return 'Advanced';
      if (score >= 250) return 'Intermediate';
      if (score >= 150) return 'Novice';
      return 'Beginner';
    }
  }

  function calculate() {
    var bw = parseFloat(document.getElementById('bodyWeight').value);
    var total = parseFloat(document.getElementById('totalLift').value);
    if (isNaN(bw) || isNaN(total) || bw <= 0 || total <= 0) return;

    var bwKg = unit === 'lbs' ? bw * 0.453592 : bw;
    var totalKg = unit === 'lbs' ? total * 0.453592 : total;

    var coeffs = sex === 'male' ? maleCoeffs : femaleCoeffs;
    var coeff = wilksCoefficient(bwKg, coeffs);
    var score = totalKg * coeff;

    document.getElementById('wilksScore').textContent = score.toFixed(2);
    document.getElementById('wilksRating').textContent = getRating(score, sex === 'male');

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('bodyWeight').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  document.getElementById('totalLift').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

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
