(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["Normal","< 120","< 80"],["Elevated","120-129","< 80"],["Stage 1","130-139","80-89"],["Stage 2","140+","90+"],["Crisis","180+","120+"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var sys=f('systolic');var dia=f('diastolic');var cat,risk,action;if(sys<120&&dia<80){cat='Normal';risk='Low';action='Maintain healthy lifestyle';}else if(sys<130&&dia<80){cat='Elevated';risk='Moderate';action='Lifestyle changes recommended';}else if(sys<140||dia<90){cat='High Blood Pressure Stage 1';risk='High';action='Lifestyle changes + consider medication';}else if(sys>=140||dia>=90){cat='High Blood Pressure Stage 2';risk='Very High';action='Medication + lifestyle changes';}else{cat='Hypertensive Crisis';risk='Dangerous';action='Seek emergency care immediately';}if(sys>=180||dia>=120){cat='Hypertensive Crisis';risk='Dangerous';action='Call 911 immediately';}var _r = {category:cat,risk:risk,action:action};

    document.getElementById('category').textContent = _r.category;
    document.getElementById('risk').textContent = _r.risk;
    document.getElementById('action').textContent = _r.action;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['systolic', 'diastolic'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
