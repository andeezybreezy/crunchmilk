(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var coinType = document.getElementById('coinType').value;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var spotPrice = parseFloat(document.getElementById('spotPrice').value) || 0;

    // Calculation logic
    var silverContent={morgan:0.7734,peace:0.7734,ike40:0.3161,eagle:1.0}; var ozPer=silverContent[coinType]||0.7734; var meltPer=ozPer*spotPrice; var totalSilver=ozPer*quantity; var totalMelt=totalSilver*spotPrice;     document.getElementById('silverPer').textContent = fmt(ozPer,4)+' troy oz';
    document.getElementById('meltPer').textContent = dollar(meltPer);
    document.getElementById('totalMelt').textContent = dollar(totalMelt);
    document.getElementById('totalSilver').textContent = fmt(totalSilver,4)+' troy oz';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['coinType', 'quantity', 'spotPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
