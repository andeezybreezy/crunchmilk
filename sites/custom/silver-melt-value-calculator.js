(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var coinType = document.getElementById('coinType').value;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var spotPrice = parseFloat(document.getElementById('spotPrice').value) || 0;

    // Calculation logic
    var coinOz={custom:weight,morgan:0.7734,washington:0.1808,roosevelt:0.0723,kennedy:0.3617,eagle:1.0}; var ozPer=coinOz[coinType]||weight; var totalOz=ozPer*quantity; var meltValue=totalOz*spotPrice; var perCoin=ozPer*spotPrice; return {meltValue:dollar(meltValue), perCoin:dollar(perCoin), totalOz:fmt(totalOz,4)+' oz'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['coinType', 'quantity', 'weight', 'spotPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
