(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var flowGPM = parseFloat(document.getElementById('flowGPM').value) || 0;
    var velocity = parseFloat(document.getElementById('velocity').value) || 0;
    var material = document.getElementById('material').value;

    // Calculation logic
    var flowCFS=flowGPM/448.83; var minArea=flowCFS/velocity; var minDia=Math.sqrt(minArea*4/Math.PI)*12; var sizes=[0.5,0.75,1,1.25,1.5,2]; var nominal=sizes[sizes.length-1]; for(var i=0;i<sizes.length;i++){if(sizes[i]>=minDia){nominal=sizes[i];break;}} var actualArea=Math.PI*Math.pow(nominal/12/2,2); var actualVel=flowCFS/actualArea;     document.getElementById('minDiameter').textContent = fmt(minDia,2)+' inches';
    document.getElementById('nominal').textContent = nominal+' inch';
    document.getElementById('velocity').textContent = fmt(actualVel,1)+' ft/s';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['flowGPM', 'velocity', 'material'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
