(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var karat = document.getElementById('karat').value;
    var spotPrice = parseFloat(document.getElementById('spotPrice').value) || 0;
    var buyerPays = parseFloat(document.getElementById('buyerPays').value) || 0;

    // Calculation logic
    var purityMap={24:0.999,22:0.917,18:0.750,14:0.583,10:0.417}; var purity=purityMap[karat]||0.583; var pureGrams=weight*purity; var pureOz=pureGrams/31.1035; var fullValue=pureOz*spotPrice; var expected=fullValue*(buyerPays/100); var perGram=expected/weight;     document.getElementById('pureGold').textContent = fmt(pureGrams,2)+' grams';
    document.getElementById('fullValue').textContent = dollar(fullValue);
    document.getElementById('expected').textContent = dollar(expected);
    document.getElementById('perGram').textContent = dollar(perGram)+'/gram';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'karat', 'spotPrice', 'buyerPays'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
