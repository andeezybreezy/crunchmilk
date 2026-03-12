(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["$100","94 months","$4,311","$9,311"],["$150","47 months","$2,003","$7,003"],["$200","31 months","$1,244","$6,244"],["$250","24 months","$916","$5,916"],["$500","11 months","$397","$5,397"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var b=f('balance');var r=f('apr')/100/12;var pmt=f('payment');if(pmt<=b*r){var _r = {months:'Payment too low',totalInt:'—',totalPaid:'—'};}var m=Math.ceil(-Math.log(1-r*b/pmt)/Math.log(1+r));var tp=pmt*m;return{months:fmt(m,0)+' months ('+fmt(m/12,1)+' years)',totalInt:$(tp-b),totalPaid:$(tp)};

    document.getElementById('months').textContent = _r.months;
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

  ['balance', 'apr', 'payment'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
