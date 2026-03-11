(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var height = parseFloat(document.getElementById('height').value) || 0;

    // Calculation logic
    var cf = (length * width * height) / 1728; var dens = weight / cf; var cls = dens >= 50 ? '50' : dens >= 35 ? '55' : dens >= 30 ? '60' : dens >= 22.5 ? '65' : dens >= 15 ? '70' : dens >= 13.5 ? '77.5' : dens >= 12 ? '85' : dens >= 10.5 ? '92.5' : dens >= 9 ? '100' : dens >= 8 ? '110' : dens >= 7 ? '125' : dens >= 6 ? '150' : dens >= 5 ? '175' : dens >= 4 ? '200' : dens >= 3 ? '250' : dens >= 2 ? '300' : dens >= 1 ? '400' : '500'; document.getElementById('density').textContent = fmt(dens, 2) + ' lbs/cu ft'; document.getElementById('freightClass').textContent = 'Class ' + cls; document.getElementById('cubicFt').textContent = fmt(cf, 2) + ' cu ft';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'length', 'width', 'height'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
