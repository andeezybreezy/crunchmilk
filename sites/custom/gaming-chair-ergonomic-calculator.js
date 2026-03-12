(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var height = parseFloat(document.getElementById('height').value) || 0;
    var legLength = parseFloat(document.getElementById('legLength').value) || 0;
    var deskHeight = parseFloat(document.getElementById('deskHeight').value) || 0;
    var monitorSize = parseFloat(document.getElementById('monitorSize').value) || 0;

    // Calculation logic
    var seatH = legLength + 1;
    var armrest = seatH + (height * 0.13);
    var monDist = monitorSize * 1.2;
    var eyeHeight = seatH + (height * 0.52);
    var monTop = eyeHeight + 2;
    document.getElementById('seatHeight').textContent = fmt(seatH, 1) + ' inches from floor';
    document.getElementById('armrestHeight').textContent = fmt(armrest, 1) + ' inches (should match desk height of ' + fmt(deskHeight, 0) + '")';
    document.getElementById('monitorDist').textContent = fmt(monDist, 0) + ' inches (' + fmt(monDist / 12, 1) + ' feet) from eyes';
    document.getElementById('monitorHeight').textContent = fmt(monTop, 1) + ' inches — top of screen at eye level';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['height', 'legLength', 'deskHeight', 'monitorSize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
