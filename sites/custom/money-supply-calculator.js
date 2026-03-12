(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentM2 = parseFloat(document.getElementById('currentM2').value) || 0;
    var growthRate = parseFloat(document.getElementById('growthRate').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;
    var gdpGrowth = parseFloat(document.getElementById('gdpGrowth').value) || 0;

    // Calculation logic
    var futureM2=currentM2*Math.pow(1+growthRate/100,years); var totalIncrease=futureM2-currentM2; var excessGrowth=growthRate-gdpGrowth; var impliedInflation=Math.max(0,excessGrowth*0.7); var dilution=(1-currentM2/futureM2)*100;     document.getElementById('futureM2').textContent = '$'+fmt(futureM2,1)+'T';
    document.getElementById('totalIncrease').textContent = '+$'+fmt(totalIncrease,1)+'T';
    document.getElementById('excessOverGDP').textContent = fmt(excessGrowth,1)+'% excess growth/year';
    document.getElementById('impliedInflation').textContent = '~'+fmt(impliedInflation,1)+'%/year';
    document.getElementById('dollarDilution').textContent = fmt(dilution,1)+'%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentM2', 'growthRate', 'years', 'gdpGrowth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
