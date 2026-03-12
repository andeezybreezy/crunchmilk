(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var jointLength = parseFloat(document.getElementById('jointLength').value) || 0;
    var jointWidth = parseFloat(document.getElementById('jointWidth').value) || 0;
    var numJoints = parseFloat(document.getElementById('numJoints').value) || 0;
    var glueType = document.getElementById('glueType').value;

    // Calculation logic
    var areaSqIn = jointLength * jointWidth * numJoints * 2;
    var coveragePerOz, openTime, clampTime;
    if (glueType === 'pva') { coveragePerOz = 25; openTime = '5-10 min'; clampTime = '30-60 min'; }
    else if (glueType === 'polyurethane') { coveragePerOz = 20; openTime = '15-20 min'; clampTime = '1-2 hours'; }
    else if (glueType === 'epoxy') { coveragePerOz = 15; openTime = '5-30 min (varies)'; clampTime = '4-24 hours'; }
    else { coveragePerOz = 22; openTime = '5-10 min'; clampTime = '45-90 min'; }
    var ozNeeded = areaSqIn / coveragePerOz;
    var mlNeeded = ozNeeded * 29.574;
    document.getElementById('totalArea').textContent = fmt(areaSqIn, 1) + ' sq in (' + fmt(areaSqIn * 6.452, 0) + ' cm²)';
    document.getElementById('glueNeeded').textContent = fmt(ozNeeded, 1) + ' oz (' + fmt(mlNeeded, 0) + ' mL)';
    document.getElementById('openTime').textContent = openTime;
    document.getElementById('clampTime').textContent = clampTime;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['jointLength', 'jointWidth', 'numJoints', 'glueType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
