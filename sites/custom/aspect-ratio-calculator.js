(function() {
  'use strict';

  var mode = 'find';
  var dimType = 'width';

  // Mode toggle
  var modeBtns = document.querySelectorAll('#modeToggle button');
  modeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      modeBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      mode = btn.dataset.mode;
      document.getElementById('findMode').style.display = mode === 'find' ? '' : 'none';
      document.getElementById('scaleMode').style.display = mode === 'scale' ? '' : 'none';
    });
  });

  // Dimension toggle
  var dimBtns = document.querySelectorAll('#dimToggle button');
  dimBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      dimBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      dimType = btn.dataset.dim;
    });
  });

  // Custom ratio toggle
  document.getElementById('ratioSelect').addEventListener('change', function() {
    document.getElementById('customRatioGroup').style.display = this.value === 'custom' ? '' : 'none';
  });

  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) { var t = b; b = a % b; a = t; }
    return a;
  }

  function calculate() {
    var w, h;

    if (mode === 'find') {
      w = parseFloat(document.getElementById('inputWidth').value);
      h = parseFloat(document.getElementById('inputHeight').value);
      if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;
    } else {
      var ratioStr = document.getElementById('ratioSelect').value;
      var rw, rh;
      if (ratioStr === 'custom') {
        rw = parseFloat(document.getElementById('customRatioW').value);
        rh = parseFloat(document.getElementById('customRatioH').value);
        if (isNaN(rw) || isNaN(rh) || rw <= 0 || rh <= 0) return;
      } else {
        var parts = ratioStr.split(':');
        rw = parseFloat(parts[0]);
        rh = parseFloat(parts[1]);
      }
      var knownVal = parseFloat(document.getElementById('knownDim').value);
      if (isNaN(knownVal) || knownVal <= 0) return;

      if (dimType === 'width') {
        w = knownVal;
        h = Math.round(knownVal * rh / rw);
      } else {
        h = knownVal;
        w = Math.round(knownVal * rw / rh);
      }
    }

    var divisor = gcd(w, h);
    var ratioW = w / divisor;
    var ratioH = h / divisor;

    // Simplify large ratios to nearest common ratio
    var decRatio = (w / h).toFixed(4);
    var commonRatios = [
      [16, 9], [4, 3], [3, 2], [1, 1], [21, 9], [9, 16], [4, 5], [2, 1]
    ];
    var displayRatio = ratioW + ':' + ratioH;
    // Check if close to a common ratio
    for (var i = 0; i < commonRatios.length; i++) {
      var cr = commonRatios[i];
      if (Math.abs((cr[0] / cr[1]) - (w / h)) < 0.01) {
        displayRatio = cr[0] + ':' + cr[1];
        break;
      }
    }
    // If ratio numbers are very large, also show simplified
    if (ratioW > 100 || ratioH > 100) {
      displayRatio = displayRatio + ' (' + ratioW + ':' + ratioH + ' exact)';
    }

    var mp = (w * h / 1000000).toFixed(2);

    document.getElementById('ratioResult').textContent = displayRatio;
    document.getElementById('decimalRatio').textContent = decRatio + ':1';
    document.getElementById('dimensions').textContent = w + ' \u00D7 ' + h + ' px';
    document.getElementById('megapixels').textContent = mp + ' MP';

    var tip = '';
    if (Math.abs(w / h - 16 / 9) < 0.01) {
      tip = 'This is standard 16:9 widescreen — perfect for HD video and modern displays.';
    } else if (Math.abs(w / h - 1) < 0.01) {
      tip = 'Square format — ideal for Instagram posts and profile images.';
    } else {
      tip = 'Orientation: ' + (w > h ? 'Landscape' : w < h ? 'Portrait' : 'Square') + '. Total pixels: ' + (w * h).toLocaleString() + '.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('#inputWidth, #inputHeight, #knownDim, #customRatioW, #customRatioH');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
