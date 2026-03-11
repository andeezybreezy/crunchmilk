(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var creditsA = parseFloat(document.getElementById('creditsA').value) || 0;
    var creditsB = parseFloat(document.getElementById('creditsB').value) || 0;
    var creditsC = parseFloat(document.getElementById('creditsC').value) || 0;
    var creditsD = parseFloat(document.getElementById('creditsD').value) || 0;
    var creditsF = parseFloat(document.getElementById('creditsF').value) || 0;

    // Calculation logic
    var totalCredits = creditsA + creditsB + creditsC + creditsD + creditsF; var points = creditsA*4 + creditsB*3 + creditsC*2 + creditsD*1 + creditsF*0; var gpa = totalCredits > 0 ? points / totalCredits : 0;     document.getElementById('gpa').textContent = fmt(gpa,2);
    document.getElementById('totalCredits').textContent = fmt(totalCredits,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['creditsA', 'creditsB', 'creditsC', 'creditsD', 'creditsF'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
