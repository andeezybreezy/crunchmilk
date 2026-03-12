(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [["5%","$1,879","$326,395","$676,395"],["5.5%","$1,987","$365,414","$715,414"],["6%","$2,098","$405,434","$755,434"],["6.5%","$2,212","$446,406","$796,406"],["7%","$2,329","$488,281","$838,281"],["7.5%","$2,447","$531,010","$881,010"]];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  var lastCalc = null;

  function calcMortgage(principal, rateAnnual, termYears, extraMonthly) {
    var r = rateAnnual / 100 / 12;
    var n = termYears * 12;
    var mp;
    if (r === 0) { mp = principal / n; } else { mp = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); }
    var totalInt = 0;
    var bal = principal;
    var months = 0;
    for (var i = 0; i < n && bal > 0; i++) {
      var interest = bal * r;
      totalInt += interest;
      var princPay = mp - interest + extraMonthly;
      if (princPay > bal) princPay = bal;
      bal -= princPay;
      months++;
      if (bal <= 0.01) break;
    }
    return { monthlyPmt: mp, totalInt: totalInt, totalPaid: mp * n, months: months };
  }

  function calculate() {
    var price = f('loanAmt'); var dp = f('downPct') / 100; var p = price * (1 - dp);
    var r = f('intRate'); var n = f('loanTerm');
    var result = calcMortgage(p, r, n, 0);

    document.getElementById('monthlyPmt').textContent = $(result.monthlyPmt);
    document.getElementById('totalInt').textContent = $(result.totalInt);
    document.getElementById('totalPaid').textContent = $(result.totalPaid);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';

    lastCalc = { principal: p, rate: r, term: n, totalInt: result.totalInt, months: result.months, monthlyPmt: result.monthlyPmt };

    document.getElementById('whatIfSection').style.display = 'block';
    updateWhatIf();
  }

  function updateWhatIf() {
    if (!lastCalc) return;
    var toggle = document.getElementById('whatIfToggle');
    if (!toggle.checked) return;

    var extra = parseFloat(document.getElementById('wiExtra').value) || 0;
    var rateChange = parseFloat(document.getElementById('wiRate').value) || 0;
    var newRate = lastCalc.rate + rateChange;
    if (newRate < 0) newRate = 0;

    var wiResult = calcMortgage(lastCalc.principal, newRate, lastCalc.term, extra);
    var saved = lastCalc.totalInt - wiResult.totalInt;
    var monthsDiff = lastCalc.months - wiResult.months;

    document.getElementById('wiOriginal').textContent = $(lastCalc.totalInt);
    document.getElementById('wiNew').textContent = $(wiResult.totalInt);
    document.getElementById('wiDelta').textContent = saved >= 0 ? $(saved) : '-' + $(Math.abs(saved));
    document.getElementById('wiDelta').style.color = saved >= 0 ? '#059669' : '#dc2626';

    var timeText = '';
    if (monthsDiff > 0) {
      var y = Math.floor(monthsDiff / 12); var m = monthsDiff % 12;
      timeText = (y > 0 ? y + ' yr ' : '') + (m > 0 ? m + ' mo ' : '') + 'sooner';
    } else if (monthsDiff < 0) {
      var y2 = Math.floor(Math.abs(monthsDiff) / 12); var m2 = Math.abs(monthsDiff) % 12;
      timeText = (y2 > 0 ? y2 + ' yr ' : '') + (m2 > 0 ? m2 + ' mo ' : '') + 'longer';
    } else {
      timeText = 'No change';
    }
    document.getElementById('wiTimeDelta').textContent = timeText;
  }

  // What If toggle
  var wiToggle = document.getElementById('whatIfToggle');
  if (wiToggle) {
    wiToggle.addEventListener('change', function() {
      document.getElementById('whatIfControls').style.display = this.checked ? 'block' : 'none';
      if (this.checked) updateWhatIf();
    });
  }

  // What If sliders
  var wiExtra = document.getElementById('wiExtra');
  var wiRate = document.getElementById('wiRate');
  if (wiExtra) {
    wiExtra.addEventListener('input', function() {
      document.getElementById('wiExtraVal').textContent = this.value;
      updateWhatIf();
    });
  }
  if (wiRate) {
    wiRate.addEventListener('input', function() {
      var v = parseFloat(this.value);
      document.getElementById('wiRateVal').textContent = (v >= 0 ? '+' : '') + v.toFixed(2);
      updateWhatIf();
    });
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['loanAmt', 'downPct', 'intRate', 'loanTerm'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
