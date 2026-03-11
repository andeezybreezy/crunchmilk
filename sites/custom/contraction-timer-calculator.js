(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var duration = parseFloat(document.getElementById('duration').value) || 0;
    var frequency = parseFloat(document.getElementById('frequency').value) || 0;
    var consistent = document.getElementById('consistent').value;

    // Calculation logic
    var perHr = 60 / frequency; var stage = ''; var action = ''; if (duration >= 60 && frequency <= 4 && consistent === 'yes') { stage = 'Active Labor (4-1-1 met)'; action = 'Go to the hospital NOW'; } else if (duration >= 45 && frequency <= 5) { stage = 'Active Labor (approaching)'; action = 'Call your provider and prepare to go'; } else if (duration >= 30 && frequency <= 8) { stage = 'Early Labor'; action = 'Rest, hydrate, time contractions. Call if water breaks.'; } else { stage = 'Pre-labor / Braxton Hicks'; action = 'Rest and monitor. These may not be true labor contractions.'; } document.getElementById('stage').textContent = stage; document.getElementById('action').textContent = action; document.getElementById('perHour').textContent = fmt(perHr, 1) + ' per hour';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['duration', 'frequency', 'consistent'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
