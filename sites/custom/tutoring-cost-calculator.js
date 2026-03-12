(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sessionsPerWeek = parseFloat(document.getElementById('sessionsPerWeek').value) || 0;
    var sessionLength = parseFloat(document.getElementById('sessionLength').value) || 0;
    var numWeeks = parseFloat(document.getElementById('numWeeks').value) || 0;
    var tutorType = document.getElementById('tutorType').value;

    // Calculation logic
    var rate = parseInt(tutorType);
    var sessionHrs = sessionLength / 60;
    var perSession = rate * sessionHrs;
    var weekly = perSession * sessionsPerWeek;
    var total = weekly * numWeeks;
    var totalHrs = sessionsPerWeek * sessionHrs * numWeeks;
    document.getElementById('costPerSession').textContent = dollar(perSession) + ' (' + sessionLength + ' min)';
    document.getElementById('weeklyCost').textContent = dollar(weekly);
    document.getElementById('totalCost').textContent = dollar(total);
    document.getElementById('totalHours').textContent = fmt(totalHrs, 0) + ' hours';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sessionsPerWeek', 'sessionLength', 'numWeeks', 'tutorType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
