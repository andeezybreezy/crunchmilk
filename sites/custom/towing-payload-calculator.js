(function() {
  'use strict';

  function calculate() {
    var gvwr = parseFloat(document.getElementById('gvwr').value);
    var curb = parseFloat(document.getElementById('curbWeight').value);
    var gcwr = parseFloat(document.getElementById('gcwr').value) || 0;
    var passengers = parseFloat(document.getElementById('passengers').value) || 0;
    var tongue = parseFloat(document.getElementById('tongueWeight').value) || 0;
    var trailer = parseFloat(document.getElementById('trailerWeight').value) || 0;

    if (isNaN(gvwr) || isNaN(curb) || gvwr <= 0 || curb <= 0) return;

    var maxPayload = gvwr - curb;
    var usedPayload = passengers + tongue;
    var remainPayload = maxPayload - usedPayload;
    var currentGVW = curb + usedPayload;

    document.getElementById('maxPayload').textContent = maxPayload.toLocaleString() + ' lbs';
    document.getElementById('remainPayload').textContent = remainPayload.toLocaleString() + ' lbs';
    document.getElementById('currentGVW').textContent = currentGVW.toLocaleString() + ' lbs';

    // Tongue weight check
    var tongueCheckEl = document.getElementById('tongueCheck');
    if (trailer > 0 && tongue > 0) {
      var tonguePct = (tongue / trailer) * 100;
      if (tonguePct >= 10 && tonguePct <= 15) {
        tongueCheckEl.textContent = tonguePct.toFixed(1) + '% — GOOD';
        tongueCheckEl.style.color = '#16a34a';
      } else if (tonguePct < 10) {
        tongueCheckEl.textContent = tonguePct.toFixed(1) + '% — TOO LOW (risk of sway)';
        tongueCheckEl.style.color = '#dc2626';
      } else {
        tongueCheckEl.textContent = tonguePct.toFixed(1) + '% — HIGH (heavy on rear axle)';
        tongueCheckEl.style.color = '#d97706';
      }
    } else {
      tongueCheckEl.textContent = '—';
      tongueCheckEl.style.color = '';
    }

    // Towing / GCWR check
    var towRemainEl = document.getElementById('towRemain');
    var gcwrCheckEl = document.getElementById('gcwrCheck');
    if (gcwr > 0) {
      var combinedWeight = currentGVW + trailer;
      var towRemain = gcwr - combinedWeight;
      towRemainEl.textContent = towRemain.toLocaleString() + ' lbs';
      if (combinedWeight <= gcwr) {
        gcwrCheckEl.textContent = 'PASS (' + combinedWeight.toLocaleString() + ' / ' + gcwr.toLocaleString() + ' lbs)';
        gcwrCheckEl.style.color = '#16a34a';
      } else {
        gcwrCheckEl.textContent = 'OVER by ' + Math.abs(towRemain).toLocaleString() + ' lbs';
        gcwrCheckEl.style.color = '#dc2626';
      }
    } else {
      towRemainEl.textContent = 'Enter GCWR';
      gcwrCheckEl.textContent = '—';
      gcwrCheckEl.style.color = '';
    }

    // Warnings
    var warnings = [];
    if (remainPayload < 0) {
      warnings.push('<strong style="color:#dc2626;">WARNING: Payload exceeded by ' + Math.abs(remainPayload).toLocaleString() + ' lbs. Over GVWR — unsafe and illegal.</strong>');
    }
    if (gcwr > 0 && (currentGVW + trailer) > gcwr) {
      warnings.push('<strong style="color:#dc2626;">WARNING: Combined weight exceeds GCWR. Reduce trailer weight or cargo.</strong>');
    }
    if (trailer > 0 && tongue > 0 && (tongue / trailer) < 0.10) {
      warnings.push('<strong style="color:#d97706;">CAUTION: Tongue weight is below 10%. Increase tongue weight to reduce trailer sway risk.</strong>');
    }
    if (remainPayload >= 0 && remainPayload < 200) {
      warnings.push('<strong style="color:#d97706;">NOTE: Very little payload margin remaining. Add fuel weight, accessories, etc.</strong>');
    }

    var warningsEl = document.getElementById('warnings');
    warningsEl.innerHTML = warnings.length > 0 ? warnings.join('<br>') : '<strong style="color:#16a34a;">All checks passed.</strong>';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('.calc-card input');
  inputs.forEach(function(inp) {
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
