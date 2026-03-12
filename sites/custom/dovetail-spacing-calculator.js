(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var boardWidth = parseFloat(document.getElementById('boardWidth').value) || 0;
    var numTails = parseFloat(document.getElementById('numTails').value) || 0;
    var pinWidth = parseFloat(document.getElementById('pinWidth').value) || 0;
    var tailAngle = document.getElementById('tailAngle').value;

    // Calculation logic
    var usable = boardWidth - 2 * pinWidth;
    var tailSpacing = usable / numTails;
    var thickness = 0.75;
    var ratio = parseInt(tailAngle);
    var slopeOffset = thickness / ratio;
    var tailWide = tailSpacing - 2 * slopeOffset + 2 * slopeOffset;
    var pinNarrow = tailSpacing - tailWide + slopeOffset;
    var marks = [];
    marks.push(fmt(pinWidth, 3) + '"');
    for (var i = 0; i < numTails; i++) {
      var pos = pinWidth + i * tailSpacing;
      marks.push(fmt(pos, 3) + '"');
    }
    marks.push(fmt(boardWidth - pinWidth, 3) + '"');
    document.getElementById('tailWidth').textContent = fmt(tailSpacing, 3) + '"';
    document.getElementById('pinSpacing').textContent = fmt(tailSpacing, 3) + '" on center';
    document.getElementById('layoutMarks').textContent = marks.join(', ');
    document.getElementById('pinNarrow').textContent = 'Ratio 1:' + ratio + ' (angle: ' + fmt(Math.atan(1/ratio)*180/Math.PI, 1) + '°)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['boardWidth', 'numTails', 'pinWidth', 'tailAngle'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
