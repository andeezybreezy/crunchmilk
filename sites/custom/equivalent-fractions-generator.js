(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var numerator = parseFloat(document.getElementById('numerator').value) || 0;
    var denominator = parseFloat(document.getElementById('denominator').value) || 0;
    var count = parseFloat(document.getElementById('count').value) || 0;

    // Calculation logic
    var n=parseInt(numerator),d=parseInt(denominator),c=parseInt(count);if(d===0){document.getElementById('equivalentList').textContent='Error: denominator cannot be zero';return;}if(c<1||c>20)c=5;var results=[];for(var i=1;i<=c;i++){results.push((n*i)+'/'+(d*i));}document.getElementById('equivalentList').textContent=results.join(', ');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['numerator', 'denominator', 'count'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
