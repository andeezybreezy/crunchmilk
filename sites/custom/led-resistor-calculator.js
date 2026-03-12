(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var supplyV = parseFloat(document.getElementById('supplyV').value) || 0;
    var ledV = parseFloat(document.getElementById('ledV').value) || 0;
    var ledMA = parseFloat(document.getElementById('ledMA').value) || 0;
    var ledCount = parseFloat(document.getElementById('ledCount').value) || 0;

    // Calculation logic
    var totalLedV=ledV*ledCount; var resistance=(supplyV-totalLedV)/(ledMA/1000); var powerW=Math.pow(ledMA/1000,2)*resistance; var stdValues=[10,22,33,47,68,100,150,220,330,470,680,1000,1500,2200,3300,4700]; var nearest=stdValues[0]; for(var i=0;i<stdValues.length;i++){if(Math.abs(stdValues[i]-resistance)<Math.abs(nearest-resistance)){nearest=stdValues[i];}} var minPower=powerW<0.125?'1/8W':powerW<0.25?'1/4W':powerW<0.5?'1/2W':'1W';     document.getElementById('resistance').textContent = fmt(resistance,0)+' Ω';
    document.getElementById('nearestStd').textContent = nearest+' Ω';
    document.getElementById('powerW').textContent = fmt(powerW*1000,1)+' mW';
    document.getElementById('minPowerRating').textContent = minPower+' or higher';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['supplyV', 'ledV', 'ledMA', 'ledCount'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
