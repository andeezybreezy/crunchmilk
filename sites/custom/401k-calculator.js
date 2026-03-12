(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
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

  var lastCalc = null;

  function calc401k(salary, contribPct, matchPct, balance, returnRate, years) {
    var r = returnRate / 100 / 12;
    var monthly = (salary * contribPct / 100 + salary * matchPct / 100) / 12;
    var fv = balance * Math.pow(1 + r, years * 12) + monthly * ((Math.pow(1 + r, years * 12) - 1) / r);
    return fv;
  }

  function calculate() {
    var sal = f('salary'); var pct_c = f('contrib'); var pct_m = f('match');
    var bal = f('balance'); var retRate = f('returnRate'); var y = f('years');
    var monthly = (sal * pct_c / 100 + sal * pct_m / 100) / 12;
    var r = retRate / 100 / 12;
    var fv = bal * Math.pow(1 + r, y * 12) + monthly * ((Math.pow(1 + r, y * 12) - 1) / r);
    var yourTotal = sal * pct_c / 100 * y;
    var empTotal = sal * pct_m / 100 * y;

    document.getElementById('finalBal').textContent = $(fv);
    document.getElementById('yourContrib').textContent = $(yourTotal);
    document.getElementById('employerContrib').textContent = $(empTotal);
    document.getElementById('growth').textContent = $(fv - bal - yourTotal - empTotal);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';

    lastCalc = { salary: sal, contrib: pct_c, match: pct_m, balance: bal, returnRate: retRate, years: y, finalBal: fv };

    document.getElementById('whatIfSection').style.display = 'block';
    updateWhatIf();
  }

  function updateWhatIf() {
    if (!lastCalc) return;
    var toggle = document.getElementById('whatIfToggle');
    if (!toggle.checked) return;

    var extraContrib = parseFloat(document.getElementById('wiContrib').value) || 0;
    var extraYears = parseFloat(document.getElementById('wiYears').value) || 0;

    var newFv = calc401k(lastCalc.salary, lastCalc.contrib + extraContrib, lastCalc.match, lastCalc.balance, lastCalc.returnRate, lastCalc.years + extraYears);
    var diff = newFv - lastCalc.finalBal;

    document.getElementById('wiOriginal').textContent = $(lastCalc.finalBal);
    document.getElementById('wiNew').textContent = $(newFv);
    document.getElementById('wiDelta').textContent = (diff >= 0 ? '+' : '-') + $(Math.abs(diff));
    document.getElementById('wiDelta').style.color = diff >= 0 ? '#059669' : '#dc2626';
  }

  var wiToggle = document.getElementById('whatIfToggle');
  if (wiToggle) {
    wiToggle.addEventListener('change', function() {
      document.getElementById('whatIfControls').style.display = this.checked ? 'block' : 'none';
      if (this.checked) updateWhatIf();
    });
  }

  var wiContrib = document.getElementById('wiContrib');
  var wiYears = document.getElementById('wiYears');
  if (wiContrib) {
    wiContrib.addEventListener('input', function() {
      document.getElementById('wiContribVal').textContent = this.value;
      updateWhatIf();
    });
  }
  if (wiYears) {
    wiYears.addEventListener('input', function() {
      document.getElementById('wiYearsVal').textContent = this.value;
      updateWhatIf();
    });
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
