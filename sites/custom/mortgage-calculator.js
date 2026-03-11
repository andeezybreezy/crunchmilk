(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["5%","$1,879","$326,395","$676,395"],["5.5%","$1,987","$365,414","$715,414"],["6%","$2,098","$405,434","$755,434"],["6.5%","$2,212","$446,406","$796,406"],["7%","$2,329","$488,281","$838,281"],["7.5%","$2,447","$531,010","$881,010"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var price=f('loanAmt');var dp=f('downPct')/100;var p=price*(1-dp);var r=f('intRate')/100/12;var n=f('loanTerm')*12;if(r===0){var mp=p/n;}else{var mp=p*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);}var _r = {monthlyPmt:$(mp),totalInt:$(mp*n-p),totalPaid:$(mp*n)};

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

  ['loanAmt', 'downPct', 'intRate', 'loanTerm'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
