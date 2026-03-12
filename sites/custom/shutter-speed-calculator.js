(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var focalLength = parseFloat(document.getElementById('focalLength').value) || 0;
    var cropFactor = parseFloat(document.getElementById('cropFactor').value) || 0;
    var subjectMotion = document.getElementById('subjectMotion').value;
    var stabilization = document.getElementById('stabilization').value;

    // Calculation logic
    var equiv = focalLength * cropFactor;
    var motionFactor = 1;
    if (subjectMotion === 'slow') motionFactor = 2;
    else if (subjectMotion === 'moderate') motionFactor = 4;
    else if (subjectMotion === 'fast') motionFactor = 8;
    var isStops = parseInt(stabilization);
    var minSpeed = equiv * motionFactor;
    var withStab = minSpeed / Math.pow(2, isStops);
    var rec;
    if (minSpeed >= 1000) rec = 'Use fast glass (f/2.8+) and high ISO. Flash may help freeze motion.';
    else if (minSpeed >= 250) rec = 'Good light or ISO 400-1600 needed. Continuous AF recommended.';
    else if (minSpeed >= 60) rec = 'Standard conditions. Most cameras handle this easily.';
    else rec = 'Tripod recommended for best results at this slow speed.';
    function shutterStr(s) { return s >= 1 ? fmt(s, 0) + 's' : '1/' + fmt(s, 0) + 's'; }
    document.getElementById('minShutter').textContent = shutterStr(minSpeed);
    document.getElementById('withIS').textContent = shutterStr(withStab);
    document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['focalLength', 'cropFactor', 'subjectMotion', 'stabilization'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
