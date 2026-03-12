(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["< 18.5","Underweight","Increased"],["18.5-24.9","Normal","Low"],["25-29.9","Overweight","Moderate"],["30-34.9","Obese I","High"],["35-39.9","Obese II","Very High"],["40+","Obese III","Extremely High"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var w=f('weight')*0.453592;var h=(f('heightFt')*12+f('heightIn'))*0.0254;var bmi=w/(h*h);var cat=bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese';var lo=Math.round(18.5*h*h/0.453592);var hi=Math.round(24.9*h*h/0.453592);var _r = {bmiVal:fmt(bmi,1),category:cat,healthy:lo+' - '+hi+' lbs'};

    document.getElementById('bmiVal').textContent = _r.bmiVal;
    document.getElementById('category').textContent = _r.category;
    document.getElementById('healthy').textContent = _r.healthy;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['weight', 'heightFt', 'heightIn'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
