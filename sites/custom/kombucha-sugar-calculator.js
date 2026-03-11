(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var batchOz = parseFloat(document.getElementById('batchOz').value) || 0;
    var phase = document.getElementById('phase').value;

    // Calculation logic
    var gallons=batchOz/128; if(phase==='first'){var sugarCups=gallons*1; var teaBags=Math.round(gallons*8); var starterOz=Math.round(batchOz*0.1); return {sugar:fmt(sugarCups,1)+' cups ('+fmt(sugarCups*200,0)+'g)', tea:teaBags+' tea bags', starterOz:starterOz+' oz starter'};}else{var tsp=batchOz/16; return {sugar:fmt(tsp,0)+' tsp for '+fmt(batchOz/16,0)+' bottles', tea:'Add fruit/juice for flavor', starterOz:'N/A for 2F'};}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['batchOz', 'phase'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
