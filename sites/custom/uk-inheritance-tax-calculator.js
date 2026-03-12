(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var estateValue = parseFloat(document.getElementById('estateValue').value) || 0;
    var propertyValue = parseFloat(document.getElementById('propertyValue').value) || 0;
    var directDescendants = document.getElementById('directDescendants').value;
    var maritalStatus = document.getElementById('maritalStatus').value;
    var giftsLast7Years = parseFloat(document.getElementById('giftsLast7Years').value) || 0;
    var charitableLegacy = parseFloat(document.getElementById('charitableLegacy').value) || 0;

    // Calculation logic
    var nrb = 325000;
    var rnrb = 0;
    if (directDescendants === 'yes') {
      rnrb = Math.min(175000, propertyValue);
      if (estateValue > 2000000) {
        var taperReduction = (estateValue - 2000000) / 2;
        rnrb = Math.max(0, rnrb - taperReduction);
      }
    }
    if (maritalStatus === 'married') {
      nrb *= 2;
      rnrb *= 2;
    }
    var totalAllowanceVal = nrb + rnrb;
    var taxableGifts = Math.max(0, giftsLast7Years - 3000);
    var taxableEstateVal = Math.max(0, estateValue + taxableGifts - totalAllowanceVal);
    var rate = 0.40;
    if (charitableLegacy >= 10) rate = 0.36;
    var iht = taxableEstateVal * rate;
    document.getElementById('nilRateBand').textContent = '\u00A3' + nrb.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('residenceNRB').textContent = '\u00A3' + rnrb.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalAllowance').textContent = '\u00A3' + totalAllowanceVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('taxableEstate').textContent = '\u00A3' + taxableEstateVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('ihtRate').textContent = (rate * 100) + '%';
    document.getElementById('ihtLiability').textContent = '\u00A3' + iht.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['estateValue', 'propertyValue', 'directDescendants', 'maritalStatus', 'giftsLast7Years', 'charitableLegacy'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
