(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var realPower = parseFloat(document.getElementById('realPower').value) || 0;
    var powerFactor = parseFloat(document.getElementById('powerFactor').value) || 0;

    // Calculation logic
    var apparentPower=realPower/powerFactor; var reactivePower=Math.sqrt(apparentPower*apparentPower-realPower*realPower); var angle=Math.acos(powerFactor)*180/Math.PI; var rating=powerFactor>=0.95?'Excellent':powerFactor>=0.85?'Good':powerFactor>=0.7?'Fair — consider correction':'Poor — correction needed';     document.getElementById('apparentPower').textContent = fmt(apparentPower,2)+' kVA';
    document.getElementById('reactivePower').textContent = fmt(reactivePower,2)+' kVAR';
    document.getElementById('pfAngle').textContent = fmt(angle,1)+'°';
    document.getElementById('efficiency').textContent = rating;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['realPower', 'powerFactor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
