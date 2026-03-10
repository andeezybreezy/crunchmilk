(function() {
  'use strict';

  var railLengthFt = document.getElementById('railLengthFt');
  var railLengthIn = document.getElementById('railLengthIn');
  var balusterWidth = document.getElementById('balusterWidth');
  var balusterWidthCustom = document.getElementById('balusterWidthCustom');
  var maxGap = document.getElementById('maxGap');

  var outBalusters = document.getElementById('outBalusters');
  var outGap = document.getElementById('outGap');
  var outSpaces = document.getElementById('outSpaces');
  var outCtoC = document.getElementById('outCtoC');
  var outCode = document.getElementById('outCode');
  var resultTip = document.getElementById('resultTip');

  balusterWidth.addEventListener('change', function() {
    if (balusterWidth.value === 'custom') {
      balusterWidthCustom.style.display = '';
      balusterWidthCustom.focus();
    } else {
      balusterWidthCustom.style.display = 'none';
      balusterWidthCustom.value = '';
    }
    calculate();
  });

  function getBWidth() {
    if (balusterWidth.value === 'custom') {
      var v = parseFloat(balusterWidthCustom.value);
      return isNaN(v) || v <= 0 ? NaN : v;
    }
    return parseFloat(balusterWidth.value);
  }

  function calculate() {
    var ft = parseFloat(railLengthFt.value) || 0;
    var inches = parseFloat(railLengthIn.value) || 0;
    var totalIn = ft * 12 + inches;
    var bw = getBWidth();
    var gap = parseFloat(maxGap.value);

    if (totalIn <= 0 || isNaN(bw) || bw <= 0) {
      outBalusters.textContent = '—';
      outGap.textContent = '—';
      outSpaces.textContent = '—';
      outCtoC.textContent = '—';
      outCode.textContent = '—';
      resultTip.textContent = 'Enter railing length to calculate.';
      return;
    }

    // Minimum balusters to stay within max gap
    // length = balusters * bw + (balusters + 1) * gap
    // balusters = (length - gap) / (bw + gap)
    var minBalusters = Math.ceil((totalIn - gap) / (bw + gap));
    if (minBalusters < 1) minBalusters = 1;

    // Calculate even spacing
    var spaces = minBalusters + 1;
    var evenGap = (totalIn - minBalusters * bw) / spaces;

    // If gap is negative, too many balusters (shouldn't happen but safeguard)
    if (evenGap < 0) {
      outBalusters.textContent = 'N/A';
      outGap.textContent = 'Railing too short';
      outSpaces.textContent = '—';
      outCtoC.textContent = '—';
      outCode.textContent = '—';
      return;
    }

    var ctoc = evenGap + bw;
    var codeOk = evenGap < 4;

    outBalusters.textContent = minBalusters;
    outGap.textContent = evenGap.toFixed(3) + '"';
    outSpaces.textContent = spaces;
    outCtoC.textContent = ctoc.toFixed(3) + '"';

    if (codeOk) {
      outCode.innerHTML = '<span style="color:#166534">Yes — ' + evenGap.toFixed(2) + '" &lt; 4"</span>';
    } else {
      outCode.innerHTML = '<span style="color:#991b1b">No — ' + evenGap.toFixed(2) + '" exceeds 4"</span>';
    }

    resultTip.textContent = minBalusters + ' balusters with ' + evenGap.toFixed(3) + '" gaps across ' + totalIn + '" of railing. Center-to-center: ' + ctoc.toFixed(3) + '".';
  }

  railLengthFt.addEventListener('input', calculate);
  railLengthIn.addEventListener('input', calculate);
  balusterWidthCustom.addEventListener('input', calculate);
  maxGap.addEventListener('change', calculate);

  calculate();
})();
