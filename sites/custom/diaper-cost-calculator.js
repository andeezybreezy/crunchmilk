(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var cpd=f('costPerDiaper');var dpd=f('diapersPerDay');var months=f('monthsToPotty');var monthly=cpd*dpd*30;var yearly=monthly*12;var total=monthly*months;var _r = {monthly:$(monthly),yearly:$(yearly),total:$(total)};

    document.getElementById('monthly').textContent = _r.monthly;
    document.getElementById('yearly').textContent = _r.yearly;
    document.getElementById('total').textContent = _r.total;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['costPerDiaper', 'diapersPerDay', 'monthsToPotty'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
