(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var convertType = document.getElementById('convertType').value;
    var value = parseFloat(document.getElementById('value').value) || 0;
    var voltage = parseFloat(document.getElementById('voltage').value) || 0;

    // Calculation logic
    var result,formula,at240; if(convertType==='ampsToWatts'){result=value*voltage; formula=value+'A × '+voltage+'V = '+fmt(result,0)+'W'; at240=value*240; return {result:fmt(result,0)+' Watts', formula:formula, at240:fmt(at240,0)+'W at 240V'};}else{result=value/voltage; formula=value+'W / '+voltage+'V = '+fmt(result,2)+'A'; at240=value/240; return {result:fmt(result,2)+' Amps', formula:formula, at240:fmt(at240,2)+'A at 240V'};}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['convertType', 'value', 'voltage'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
