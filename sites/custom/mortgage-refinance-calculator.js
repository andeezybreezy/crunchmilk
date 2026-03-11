(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["5%","$1,503","$261,116","$541,116"],["5.5%","$1,590","$292,331","$572,331"],["6%","$1,679","$324,347","$604,347"],["6.5%","$1,770","$357,125","$637,125"],["7%","$1,863","$390,625","$670,625"],["7.5%","$1,958","$424,808","$704,808"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var p=f('loanAmt');var r1=f('curRate')/100/12;var r2=f('newRate')/100/12;var n=f('loanTerm')*12;var cc=f('closingCosts');var mp1=p*(r1*Math.pow(1+r1,n))/(Math.pow(1+r1,n)-1);var mp2=p*(r2*Math.pow(1+r2,n))/(Math.pow(1+r2,n)-1);var save=mp1-mp2;var be=save>0?Math.ceil(cc/save):0;var _r = {curPmt:$(mp1),newPmt:$(mp2),monthlySave:$(save),breakEven:fmt(be,0)+' months'};

    document.getElementById('curPmt').textContent = _r.curPmt;
    document.getElementById('newPmt').textContent = _r.newPmt;
    document.getElementById('monthlySave').textContent = _r.monthlySave;
    document.getElementById('breakEven').textContent = _r.breakEven;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['loanAmt', 'curRate', 'newRate', 'loanTerm', 'closingCosts'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
