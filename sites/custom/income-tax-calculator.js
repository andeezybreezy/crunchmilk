(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["$0 – $11,600","10%","$1,160","$1,160"],["$11,601 – $47,150","12%","$4,266","$5,426"],["$47,151 – $100,525","22%","$11,742","$17,168"],["$100,526 – $191,950","24%","$21,942","$39,110"],["$191,951 – $243,725","32%","$16,568","$55,678"],["$243,726 – $609,350","35%","$127,969","$183,647"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var inc=f('income');var fs=f('filing');var brackets,rates;if(fs===2){brackets=[23200,94300,201050,383900,487450,731200,Infinity];rates=[0.10,0.12,0.22,0.24,0.32,0.35,0.37];}else{brackets=[11600,47150,100525,191950,243725,609350,Infinity];rates=[0.10,0.12,0.22,0.24,0.32,0.35,0.37];}var tax=0;var prev=0;var marg=0;for(var i=0;i<brackets.length;i++){var upper=brackets[i];var taxable=Math.min(inc,upper)-prev;if(taxable>0){tax+=taxable*rates[i];marg=rates[i];}if(inc<=upper)break;prev=upper;}var _r = {totalTax:$(tax),effRate:pct(tax/inc*100,1),margRate:pct(marg*100,0)};

    document.getElementById('totalTax').textContent = _r.totalTax;
    document.getElementById('effRate').textContent = _r.effRate;
    document.getElementById('margRate').textContent = _r.margRate;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['income', 'filing'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
