(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["5","$37,500","$15,000","$156,818"],["10","$75,000","$30,000","$304,511"],["15","$112,500","$45,000","$510,249"],["20","$150,000","$60,000","$800,584"],["25","$187,500","$75,000","$1,214,321"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var sal=f('salary');var pct_c=f('contrib')/100;var pct_m=f('match')/100;var bal=f('balance');var r=f('returnRate')/100/12;var y=f('years');var monthly=(sal*pct_c+sal*pct_m)/12;var fv=bal*Math.pow(1+r,y*12)+monthly*((Math.pow(1+r,y*12)-1)/r);var yourTotal=sal*pct_c*y;var empTotal=sal*pct_m*y;var _r = {finalBal:$(fv),yourContrib:$(yourTotal),employerContrib:$(empTotal),growth:$(fv-bal-yourTotal-empTotal)};

    document.getElementById('finalBal').textContent = _r.finalBal;
    document.getElementById('yourContrib').textContent = _r.yourContrib;
    document.getElementById('employerContrib').textContent = _r.employerContrib;
    document.getElementById('growth').textContent = _r.growth;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['salary', 'contrib', 'match', 'balance', 'returnRate', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
