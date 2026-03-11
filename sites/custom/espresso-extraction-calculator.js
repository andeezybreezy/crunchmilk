(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dose = parseFloat(document.getElementById('dose').value) || 0;
    var yieldVal = parseFloat(document.getElementById('yield').value) || 0;
    var time = parseFloat(document.getElementById('time').value) || 0;

    // Calculation logic
    var ratio=yieldVal/dose; var flowRate=yieldVal/time; var assessment=''; if(ratio<1.5){assessment='Ristretto — very concentrated, intense';}else if(ratio<2.5){assessment='Normal espresso range — balanced';}else{assessment='Lungo — lighter, more volume';} if(time<22){assessment+=' | Running fast — grind finer';}else if(time>35){assessment+=' | Running slow — grind coarser';} return {ratio:'1:'+fmt(ratio,1), flowRate:fmt(flowRate,2)+' g/s', assessment:assessment};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dose', 'yield', 'time'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
