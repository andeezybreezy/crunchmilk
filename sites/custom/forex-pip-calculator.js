(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var pair = document.getElementById('pair').value;
    var lots = parseFloat(document.getElementById('lots').value) || 0;
    var price = parseFloat(document.getElementById('price').value) || 0;

    // Calculation logic
    var unitSize=lots*100000; var isJpy=pair.indexOf('JPY')!==-1; var pipSize=isJpy?0.01:0.0001; var pipVal; if(pair.indexOf('USD')===4){pipVal=pipSize*unitSize;}else{pipVal=(pipSize/price)*unitSize;} var microPip=pipVal/100; var miniPip=pipVal/10;     document.getElementById('pipVal').textContent = dollar(pipVal);
    document.getElementById('microPip').textContent = dollar(microPip);
    document.getElementById('miniPip').textContent = dollar(miniPip);
    document.getElementById('tenPips').textContent = dollar(pipVal*10);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['pair', 'lots', 'price'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
