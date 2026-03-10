(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function tireDiameter(widthMm, aspectRatio, rimIn) {
    // sidewall height in inches = width_mm * aspect_ratio / 100 / 25.4
    var sidewall = widthMm * aspectRatio / 100 / 25.4;
    return 2 * sidewall + rimIn;
  }

  function calculate() {
    var ow = val('origWidth'), oa = val('origAspect'), or_ = val('origRim');
    var nw = val('newWidth'), na = val('newAspect'), nr = val('newRim');

    if (ow <= 0 || oa <= 0 || or_ <= 0 || nw <= 0 || na <= 0 || nr <= 0) return;

    var origD = tireDiameter(ow, oa, or_);
    var newD = tireDiameter(nw, na, nr);

    var origCirc = Math.PI * origD;
    var newCirc = Math.PI * newD;

    var origRevMile = 63360 / origCirc;
    var newRevMile = 63360 / newCirc;

    var diamDiff = newD - origD;
    var speedoErrorPct = ((newD - origD) / origD) * 100;
    var actualAt60 = 60 * (newD / origD);

    document.getElementById('origDiam').textContent = origD.toFixed(2) + '"';
    document.getElementById('newDiam').textContent = newD.toFixed(2) + '"';
    document.getElementById('diamDiff').textContent = (diamDiff >= 0 ? '+' : '') + diamDiff.toFixed(2) + '" (' + (speedoErrorPct >= 0 ? '+' : '') + speedoErrorPct.toFixed(1) + '%)';
    document.getElementById('speedoError').textContent = (speedoErrorPct >= 0 ? '+' : '') + speedoErrorPct.toFixed(2) + '%';
    document.getElementById('origRev').textContent = Math.round(origRevMile).toLocaleString();
    document.getElementById('newRev').textContent = Math.round(newRevMile).toLocaleString();
    document.getElementById('actualSpeed').textContent = actualAt60.toFixed(1) + ' mph';

    var within = Math.abs(speedoErrorPct) <= 3 ? 'Within 3% — acceptable range.' : 'Over 3% — may affect ABS/traction control.';
    document.getElementById('resultTip').textContent = within;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var sizes = [
      { w: 205, a: 55, r: 16 },
      { w: 215, a: 60, r: 16 },
      { w: 225, a: 60, r: 16 },
      { w: 225, a: 45, r: 17 },
      { w: 245, a: 45, r: 17 },
      { w: 255, a: 55, r: 18 },
      { w: 265, a: 70, r: 17 },
      { w: 275, a: 60, r: 20 },
      { w: 315, a: 70, r: 17 }
    ];
    sizes.forEach(function(s) {
      var d = tireDiameter(s.w, s.a, s.r);
      var c = Math.PI * d;
      var rev = 63360 / c;
      var tr = document.createElement('tr');
      [s.w + '/' + s.a + 'R' + s.r, d.toFixed(1) + '"', c.toFixed(1) + '"', Math.round(rev).toString()].forEach(function(txt) {
        var td = document.createElement('td');
        td.textContent = txt;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
