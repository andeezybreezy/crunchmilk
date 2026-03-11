(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalWatts = parseFloat(document.getElementById('totalWatts').value) || 0;
    var voltage = document.getElementById('voltage').value;
    var continuous = document.getElementById('continuous').value;

    // Calculation logic
    var v=parseInt(voltage); var amps=totalWatts/v; var designAmps=continuous==='yes'?amps/0.8:amps; var sizes=[15,20,30,40,50,60]; var breakerSize=15; for(var i=0;i<sizes.length;i++){if(sizes[i]>=designAmps){breakerSize=sizes[i];break;}} var wireSizes={15:'14 AWG',20:'12 AWG',30:'10 AWG',40:'8 AWG',50:'6 AWG',60:'4 AWG'}; var note=continuous==='yes'?'Continuous loads derated to 80% of breaker rating':'Standard load — breaker sized to load';     document.getElementById('amps').textContent = fmt(amps,1)+' A';
    document.getElementById('breakerSize').textContent = breakerSize+'A breaker';
    document.getElementById('wireSize').textContent = wireSizes[breakerSize];
    document.getElementById('note').textContent = note;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalWatts', 'voltage', 'continuous'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
