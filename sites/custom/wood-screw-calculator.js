(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var materialThickness = parseFloat(document.getElementById('materialThickness').value) || 0;
    var screwGauge = document.getElementById('screwGauge').value;
    var woodType = document.getElementById('woodType').value;

    // Calculation logic
    var gauge = parseInt(screwGauge);
    var shankDia = 0.060 + gauge * 0.013;
    var rootDia = shankDia * 0.65;
    var pilotSoft = rootDia * 0.85;
    var pilotHard = rootDia * 1.0;
    var pilot = woodType === 'hard' ? pilotHard : pilotSoft;
    var clearance = shankDia + 0.01;
    var counter = shankDia * 2;
    var recLength = materialThickness + (materialThickness * 1.5);
    recLength = Math.ceil(recLength * 4) / 4;
    function toFraction(n) {
      var sixteenths = Math.round(n * 16);
      if (sixteenths % 16 === 0) return (sixteenths/16) + '"';
      if (sixteenths % 8 === 0) return (sixteenths/16) + '" (' + (sixteenths/8) + '/2")';
      if (sixteenths % 4 === 0) return (sixteenths/16).toFixed(3) + '" (' + (sixteenths/4) + '/4")';
      return (sixteenths/16).toFixed(3) + '" (' + sixteenths + '/16")';
    }
    var nearestBit = function(d) { var s = Math.round(d * 64) / 64; return fmt(s, 4) + '" (' + Math.round(s * 64) + '/64")'; };
    document.getElementById('screwLength').textContent = fmt(recLength, 2) + '"';
    document.getElementById('pilotHole').textContent = nearestBit(pilot);
    document.getElementById('clearanceHole').textContent = nearestBit(clearance);
    document.getElementById('countersink').textContent = nearestBit(counter);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['materialThickness', 'screwGauge', 'woodType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
