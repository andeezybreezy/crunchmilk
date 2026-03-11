(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var initial = parseFloat(document.getElementById('initial').value) || 0;
    var annualAdd = parseFloat(document.getElementById('annualAdd').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;
    var goldReturn = parseFloat(document.getElementById('goldReturn').value) || 0;
    var annualFee = parseFloat(document.getElementById('annualFee').value) || 0;

    // Calculation logic
    var bal=initial; var totalFees=0; var totalContrib=initial; for(var i=0;i<years;i++){bal=bal*(1+(goldReturn-annualFee)/100); bal+=annualAdd; totalContrib+=annualAdd; totalFees+=bal*(annualFee/100);} var growth=bal-totalContrib; var netReturn=goldReturn-annualFee; return {futureValue:dollar(bal), totalContrib:dollar(totalContrib), totalGrowth:dollar(growth), totalFees:dollar(totalFees), netReturn:fmt(netReturn,1)+'%'};

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
