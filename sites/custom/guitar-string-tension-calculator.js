(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gauge = parseFloat(document.getElementById('gauge').value) || 0;
    var scaleLength = parseFloat(document.getElementById('scaleLength').value) || 0;
    var frequency = parseFloat(document.getElementById('frequency').value) || 0;
    var stringType = document.getElementById('stringType').value;

    // Calculation logic
    var uw = parseFloat(stringType) * Math.pow(gauge * 1000, 2);
    var tensionLbs = (uw * Math.pow(2 * scaleLength * frequency, 2)) / 386.4;
    var rating = tensionLbs < 12 ? 'Low tension — easy bending, may buzz' : (tensionLbs < 18 ? 'Medium tension — good balance' : (tensionLbs < 25 ? 'High tension — stiff feel, loud' : 'Very high — check neck relief'));
    document.getElementById('tension').textContent = fmt(tensionLbs, 2) + ' lbs (' + fmt(tensionLbs * 0.4536, 2) + ' kg)';
    document.getElementById('unitWeight').textContent = fmt(uw * 1000000, 4) + ' lbs/in (x10^-6)';
    document.getElementById('recommendation').textContent = rating;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gauge', 'scaleLength', 'frequency', 'stringType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
