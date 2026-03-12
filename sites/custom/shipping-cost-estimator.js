(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var height = parseFloat(document.getElementById('height').value) || 0;
    var zone = document.getElementById('zone').value;

    // Calculation logic
    var z = parseFloat(zone); var dimW = (length * width * height) / 139; var billW = Math.max(weight, dimW); var baseGround = 7.5 + (billW * 0.45) + (z * 1.2); var baseExpress = 15 + (billW * 0.85) + (z * 2.5); document.getElementById('dimWeight').textContent = fmt(dimW, 1) + ' lbs'; document.getElementById('billWeight').textContent = fmt(billW, 1) + ' lbs'; document.getElementById('groundEst').textContent = dollar(baseGround); document.getElementById('expressEst').textContent = dollar(baseExpress); document.getElementById('resultTip').textContent = dimW > weight ? 'DIM weight exceeds actual — you are billed for dimensional weight.' : 'Actual weight is used for billing.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'length', 'width', 'height', 'zone'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
