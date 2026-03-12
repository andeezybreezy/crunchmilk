(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var initial = parseFloat(document.getElementById('initial').value) || 0;
    var annualAdd = parseFloat(document.getElementById('annualAdd').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;
    var goldReturn = parseFloat(document.getElementById('goldReturn').value) || 0;
    var annualFee = parseFloat(document.getElementById('annualFee').value) || 0;

    // Calculation logic
    var bal=initial; var totalFees=0; var totalContrib=initial; for(var i=0;i<years;i++){bal=bal*(1+(goldReturn-annualFee)/100); bal+=annualAdd; totalContrib+=annualAdd; totalFees+=bal*(annualFee/100);} var growth=bal-totalContrib; var netReturn=goldReturn-annualFee;     document.getElementById('futureValue').textContent = dollar(bal);
    document.getElementById('totalContrib').textContent = dollar(totalContrib);
    document.getElementById('totalGrowth').textContent = dollar(growth);
    document.getElementById('totalFees').textContent = dollar(totalFees);
    document.getElementById('netReturn').textContent = fmt(netReturn,1)+'%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['initial', 'annualAdd', 'years', 'goldReturn', 'annualFee'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
