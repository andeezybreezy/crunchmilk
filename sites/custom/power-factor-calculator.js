(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var realPower = parseFloat(document.getElementById('realPower').value) || 0;
    var powerFactor = parseFloat(document.getElementById('powerFactor').value) || 0;

    // Calculation logic
    var apparentPower=realPower/powerFactor; var reactivePower=Math.sqrt(apparentPower*apparentPower-realPower*realPower); var angle=Math.acos(powerFactor)*180/Math.PI; var rating=powerFactor>=0.95?'Excellent':powerFactor>=0.85?'Good':powerFactor>=0.7?'Fair — consider correction':'Poor — correction needed'; return {apparentPower:fmt(apparentPower,2)+' kVA', reactivePower:fmt(reactivePower,2)+' kVAR', pfAngle:fmt(angle,1)+'°', efficiency:rating};

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
