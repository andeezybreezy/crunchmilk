(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["5%","$283","$1,984","$16,984"],["5.5%","$287","$2,191","$17,191"],["6%","$290","$2,400","$17,400"],["6.5%","$293","$2,610","$17,610"],["7%","$297","$2,821","$17,821"],["7.5%","$301","$3,034","$18,034"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var p=f('loanAmt');var r=f('intRate')/100/12;var n=f('loanTerm')*12;if(r===0){var mp=p/n;}else{var mp=p*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);}var _r = {monthlyPmt:$(mp),totalInt:$(mp*n-p),totalPaid:$(mp*n)};

    document.getElementById('monthlyPmt').textContent = _r.monthlyPmt;
    document.getElementById('totalInt').textContent = _r.totalInt;
    document.getElementById('totalPaid').textContent = _r.totalPaid;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['loanAmt', 'intRate', 'loanTerm'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
