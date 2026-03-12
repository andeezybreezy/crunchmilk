(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weightValue = parseFloat(document.getElementById('weightValue').value) || 0;
    var fromUnit = document.getElementById('fromUnit').value;

    // Calculation logic
    var gsm;
    if (fromUnit === 'gsm') gsm = weightValue;
    else if (fromUnit === 'bond') gsm = weightValue * 3.76;
    else if (fromUnit === 'cover') gsm = weightValue * 2.708;
    else if (fromUnit === 'index') gsm = weightValue * 1.81;
    var bond = gsm / 3.76;
    var cover = gsm / 2.708;
    var idx = gsm / 1.81;
    var mils = gsm * 0.06;
    document.getElementById('gsmResult').textContent = fmt(gsm, 1) + ' g/m²';
    document.getElementById('bondResult').textContent = fmt(bond, 1) + ' lb';
    document.getElementById('coverResult').textContent = fmt(cover, 1) + ' lb';
    document.getElementById('thicknessMils').textContent = fmt(mils, 1) + ' mils';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weightValue', 'fromUnit'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
