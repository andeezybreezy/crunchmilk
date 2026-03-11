(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var babyWeight = parseFloat(document.getElementById('babyWeight').value) || 0;

    // Calculation logic
    var size, range, daily; if (babyWeight <= 6) { size = 'Preemie'; range = 'Up to 6 lbs'; daily = 12; } else if (babyWeight <= 10) { size = 'Newborn (N)'; range = '6-10 lbs'; daily = 10; } else if (babyWeight <= 14) { size = 'Size 1'; range = '8-14 lbs'; daily = 10; } else if (babyWeight <= 18) { size = 'Size 2'; range = '12-18 lbs'; daily = 9; } else if (babyWeight <= 28) { size = 'Size 3'; range = '16-28 lbs'; daily = 8; } else if (babyWeight <= 37) { size = 'Size 4'; range = '22-37 lbs'; daily = 7; } else if (babyWeight <= 50) { size = 'Size 5'; range = '27-50 lbs'; daily = 6; } else { size = 'Size 6'; range = '35+ lbs'; daily = 5; } var monthlyCost = daily * 30 * 0.25; document.getElementById('diaperSize').textContent = size; document.getElementById('weightRange').textContent = range; document.getElementById('dailyCount').textContent = daily + ' diapers/day'; document.getElementById('monthlyCost').textContent = dollar(monthlyCost) + '/month (~' + dollar(0.25) + '/diaper)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['babyWeight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
