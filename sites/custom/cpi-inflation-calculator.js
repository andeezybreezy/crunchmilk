(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var category = document.getElementById('category').value;
    var monthlySpend = parseFloat(document.getElementById('monthlySpend').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var rates={all:3.2,food:5.1,shelter:6.2,energy:3.8,medical:3.5,education:4.8,vehicles:1.2}; var rate=rates[category]||3.2; var cumulative=Math.pow(1+rate/100,years); var futureMonthly=monthlySpend*cumulative; var increase=futureMonthly-monthlySpend; var totalExtra=0; for(var i=1;i<=years*12;i++){totalExtra+=(monthlySpend*Math.pow(1+rate/100,i/12))-monthlySpend;}     document.getElementById('futureMonthly').textContent = dollar(futureMonthly)+'/month';
    document.getElementById('increase').textContent = '+'+dollar(increase)+'/month';
    document.getElementById('totalExtra').textContent = dollar(totalExtra)+' extra over '+years+' years';
    document.getElementById('cumulativePct').textContent = '+'+fmt((cumulative-1)*100,1)+'%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['category', 'monthlySpend', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
