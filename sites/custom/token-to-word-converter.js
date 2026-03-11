(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var direction = document.getElementById('direction').value;

    // Calculation logic
    var words,tokens; if(direction==='tokensToWords'){tokens=amount;words=Math.round(amount*0.75);}else{words=amount;tokens=Math.round(amount*1.33);} var pages=Math.round(words/250*10)/10; var readTime=Math.round(words/200); return {result:direction==='tokensToWords'?fmt(words,0)+' words':fmt(tokens,0)+' tokens', pages:fmt(pages,1)+' pages', readTime:readTime+' min read'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'direction'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
