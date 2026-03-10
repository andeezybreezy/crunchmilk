(function() {
  'use strict';

  var direction = 'future';

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Direction toggle
  var dirBtns = document.querySelectorAll('#dirToggle button');
  dirBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      dirBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      direction = btn.getAttribute('data-dir');

      if (direction === 'future') {
        document.getElementById('startLabel').textContent = 'Start Year';
        document.getElementById('endLabel').textContent = 'End Year';
      } else {
        document.getElementById('startLabel').textContent = 'Year of Original Amount';
        document.getElementById('endLabel').textContent = 'Current Year';
      }
    });
  });

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var startYear = parseInt(document.getElementById('startYear').value) || 0;
    var endYear = parseInt(document.getElementById('endYear').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 3;

    if (amount <= 0 || startYear <= 0 || endYear <= 0) return;

    var years = Math.abs(endYear - startYear);
    if (years === 0) return;

    var rateDecimal = rate / 100;
    var adjustedAmount;

    if (direction === 'future') {
      // Future value: how much will you need in the future
      adjustedAmount = amount * Math.pow(1 + rateDecimal, years);
      document.getElementById('origLabel').textContent = 'Amount in ' + startYear;
      document.getElementById('adjLabel').textContent = 'Equivalent in ' + endYear;
    } else {
      // Past to today: what was past money worth in today's dollars
      adjustedAmount = amount * Math.pow(1 + rateDecimal, years);
      document.getElementById('origLabel').textContent = 'Amount in ' + startYear;
      document.getElementById('adjLabel').textContent = "Today's Equivalent";
    }

    var totalInflation = ((adjustedAmount - amount) / amount) * 100;
    var powerChange = ((amount / adjustedAmount) - 1) * 100;

    document.getElementById('origAmount').textContent = fmt(amount);
    document.getElementById('adjAmount').textContent = fmt(adjustedAmount);
    document.getElementById('totalInflation').textContent = totalInflation.toFixed(1) + '%';
    document.getElementById('powerChange').textContent = powerChange.toFixed(1) + '%';
    document.getElementById('numYears').textContent = years + (years === 1 ? ' year' : ' years');
    document.getElementById('avgRate').textContent = rate.toFixed(1) + '%';
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
