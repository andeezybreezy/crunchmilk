(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["$50,000","$1,923","$435","$1,488","$38,692"],["$65,000","$2,500","$566","$1,934","$50,292"],["$80,000","$3,077","$696","$2,381","$61,892"],["$100,000","$3,846","$870","$2,976","$77,385"],["$120,000","$4,615","$1,045","$3,571","$92,838"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var sal=f('salary');var pp=f('payFreq');var gross=sal/pp;var fed=gross*f('fedRate')/100;var st=gross*f('stateRate')/100;var fica=gross*0.0765;var net=gross-fed-st-fica;var _r = {grossPay:$(gross),fedTax:$(fed),stateTax:$(st),fica:$(fica),netPay:$(net)};

    document.getElementById('grossPay').textContent = _r.grossPay;
    document.getElementById('fedTax').textContent = _r.fedTax;
    document.getElementById('stateTax').textContent = _r.stateTax;
    document.getElementById('fica').textContent = _r.fica;
    document.getElementById('netPay').textContent = _r.netPay;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['salary', 'payFreq', 'fedRate', 'stateRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
