(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["Beginner","135 lbs","75%"],["Intermediate","185 lbs","103%"],["Advanced","245 lbs","136%"],["Elite","315 lbs","175%"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var w=f('weight');var r=f('reps');var orm=w*(1+r/30);var f5=orm*0.87;var f10=orm*0.75;var _r = {oneRM:fmt(orm,0)+' lbs',fiveRM:fmt(f5,0)+' lbs',tenRM:fmt(f10,0)+' lbs'};

    document.getElementById('oneRM').textContent = _r.oneRM;
    document.getElementById('fiveRM').textContent = _r.fiveRM;
    document.getElementById('tenRM').textContent = _r.tenRM;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['weight', 'reps'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
