(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var buildingSqFt = parseFloat(document.getElementById('buildingSqFt').value) || 0;
    var ramp = document.getElementById('ramp').value;
    var restroom = document.getElementById('restroom').value;
    var doorways = parseFloat(document.getElementById('doorways').value) || 0;
    var signage = document.getElementById('signage').value;

    // Calculation logic
    var rampCosts = {'no':0,'yes':3500,'long':8000};
    var restroomCosts = {'no':0,'partial':3000,'full':12000};
    var rampC = rampCosts[ramp];
    var restroomC = restroomCosts[restroom];
    var doorC = doorways * 1500;
    var signageC = signage === 'yes' ? Math.max(500, buildingSqFt * 0.10) : 0;
    var total = rampC + restroomC + doorC + signageC;
    document.getElementById('rampCost').textContent = rampC > 0 ? dollar(rampC) : 'Not needed';
    document.getElementById('restroomCost').textContent = restroomC > 0 ? dollar(restroomC) : 'Not needed';
    document.getElementById('doorCost').textContent = doorways > 0 ? dollar(doorC) + ' (' + fmt(doorways, 0) + ' doorways x $1,500)' : 'Not needed';
    document.getElementById('totalCost').textContent = dollar(total) + (signageC > 0 ? ' (includes ' + dollar(signageC) + ' signage)' : '');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['buildingSqFt', 'ramp', 'restroom', 'doorways', 'signage'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
