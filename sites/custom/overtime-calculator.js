(function() {
  'use strict';

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function calculate() {
    var rate = parseFloat(document.getElementById('hourlyRate').value) || 0;
    var regHours = parseFloat(document.getElementById('regularHours').value) || 40;
    var otHours = parseFloat(document.getElementById('otHours').value) || 0;
    var otMult = parseFloat(document.getElementById('otMultiplier').value) || 1.5;
    var dtHours = parseFloat(document.getElementById('dtHours').value) || 0;

    if (rate <= 0) return;

    var regPay = rate * regHours;
    var otRate = rate * otMult;
    var otPay = otRate * otHours;
    var dtRate = rate * 2;
    var dtPay = dtRate * dtHours;
    var weeklyGross = regPay + otPay + dtPay;
    var totalHours = regHours + otHours + dtHours;

    document.getElementById('regPay').textContent = fmt(regPay);
    document.getElementById('otRate').textContent = fmt(otRate) + '/hr';
    document.getElementById('otPay').textContent = fmt(otPay);
    document.getElementById('dtPay').textContent = fmt(dtPay);
    document.getElementById('weeklyGross').textContent = fmt(weeklyGross);
    document.getElementById('totalHours').textContent = totalHours.toFixed(1) + ' hrs';
    document.getElementById('biweeklyGross').textContent = fmt(weeklyGross * 2);
    document.getElementById('monthlyGross').textContent = fmt(weeklyGross * 52 / 12);
    document.getElementById('result').classList.add('visible');
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
