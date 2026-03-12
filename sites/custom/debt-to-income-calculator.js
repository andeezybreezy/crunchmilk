(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["Under 28%","Excellent","Very high — best rates available"],["28-36%","Good","High — qualifies for most programs"],["36-43%","Fair","Moderate — may need compensating factors"],["43-50%","Borderline","Low — limited to FHA or special programs"],["Over 50%","Poor","Very low — unlikely without exceptions"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var inc=f('income');var housing=f('mortgage');var total=housing+f('carPmt')+f('studentPmt')+f('ccPmt')+f('otherDebt');var fe=housing/inc*100;var be=total/inc*100;var status=be<=36?'Excellent — easily qualifies':be<=43?'Acceptable — meets most lender requirements':be<=50?'Borderline — may qualify with strong compensating factors':'Too high — unlikely to qualify';var _r = {frontEnd:pct(fe,1),backEnd:pct(be,1),status:status};

    document.getElementById('frontEnd').textContent = _r.frontEnd;
    document.getElementById('backEnd').textContent = _r.backEnd;
    document.getElementById('status').textContent = _r.status;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['income', 'mortgage', 'carPmt', 'studentPmt', 'ccPmt', 'otherDebt'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
