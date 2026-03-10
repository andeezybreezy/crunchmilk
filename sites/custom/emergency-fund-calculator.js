(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function fmtDollars(n) {
    var sign = n < 0 ? '-' : '';
    return sign + '$' + fmt(Math.abs(n), 0).replace(/\..*/, '');
  }

  // DOM refs
  var rent = document.getElementById('rent');
  var utilities = document.getElementById('utilities');
  var food = document.getElementById('food');
  var insurance = document.getElementById('insurance');
  var debt = document.getElementById('debt');
  var other = document.getElementById('other');
  var stability = document.getElementById('stability');
  var dependents = document.getElementById('dependents');
  var currentSavings = document.getElementById('currentSavings');
  var monthlyContrib = document.getElementById('monthlyContrib');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rRange = document.getElementById('rRange');
  var rTarget = document.getElementById('rTarget');
  var rGap = document.getElementById('rGap');
  var rMonths = document.getElementById('rMonths');
  var resultDetails = document.getElementById('resultDetails');

  // Chart
  var chartData = [
    ['$2,000', '$6,000 – $12,000', '$12,000 – $18,000', '$18,000 – $24,000'],
    ['$3,000', '$9,000 – $18,000', '$18,000 – $27,000', '$27,000 – $36,000'],
    ['$4,000', '$12,000 – $24,000', '$24,000 – $36,000', '$36,000 – $48,000'],
    ['$5,000', '$15,000 – $30,000', '$30,000 – $45,000', '$45,000 – $60,000'],
    ['$6,000', '$18,000 – $36,000', '$36,000 – $54,000', '$54,000 – $72,000'],
    ['$8,000', '$24,000 – $48,000', '$48,000 – $72,000', '$72,000 – $96,000']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  // Months ranges by stability
  var ranges = {
    stable:   { low: 3, high: 6 },
    moderate: { low: 6, high: 9 },
    variable: { low: 9, high: 12 }
  };

  function calculate() {
    var monthlyExpenses = getVal(rent) + getVal(utilities) + getVal(food) +
                          getVal(insurance) + getVal(debt) + getVal(other);

    if (monthlyExpenses <= 0) { hideResult(); return; }

    var stab = stability.value;
    var deps = parseInt(dependents.value) || 0;
    var savings = getVal(currentSavings);
    var contrib = getVal(monthlyContrib);

    // Base range
    var range = ranges[stab] || ranges.moderate;
    var lowMonths = range.low;
    var highMonths = range.high;

    // Adjust for dependents: +1 month per dependent, capped
    lowMonths += deps;
    highMonths += deps;

    var lowTarget = monthlyExpenses * lowMonths;
    var highTarget = monthlyExpenses * highMonths;
    var midTarget = (lowTarget + highTarget) / 2;

    var gap = Math.max(0, midTarget - savings);
    var monthsToGoal = contrib > 0 ? Math.ceil(gap / contrib) : (gap > 0 ? Infinity : 0);

    var progressPct = midTarget > 0 ? Math.min(100, (savings / midTarget) * 100) : 0;

    rRange.textContent = fmtDollars(lowTarget) + ' – ' + fmtDollars(highTarget);
    rRange.style.fontSize = '1rem';
    rTarget.textContent = fmtDollars(midTarget);
    rTarget.style.color = '#059669';

    if (gap <= 0) {
      rGap.textContent = 'Fully funded!';
      rGap.style.color = '#059669';
    } else {
      rGap.textContent = fmtDollars(gap);
      rGap.style.color = '#dc2626';
    }

    if (gap <= 0) {
      rMonths.textContent = '0';
      rMonths.style.color = '#059669';
    } else if (monthsToGoal === Infinity) {
      rMonths.textContent = 'Enter savings amount';
      rMonths.style.color = '#d97706';
    } else {
      rMonths.textContent = monthsToGoal + ' months';
      if (monthsToGoal <= 12) rMonths.style.color = '#059669';
      else if (monthsToGoal <= 24) rMonths.style.color = '#d97706';
      else rMonths.style.color = '#dc2626';
    }

    var d = '';

    // Expense breakdown
    d += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:0.85rem">';
    var expenses = [
      ['Rent/Mortgage', getVal(rent)],
      ['Utilities', getVal(utilities)],
      ['Food', getVal(food)],
      ['Insurance', getVal(insurance)],
      ['Debt Payments', getVal(debt)],
      ['Other', getVal(other)]
    ];
    expenses.forEach(function(e) {
      if (e[1] > 0) {
        var pct = (e[1] / monthlyExpenses) * 100;
        d += '<div style="padding:8px;background:#f9fafb;border-radius:6px">' + e[0] + '<br><strong>' + fmtDollars(e[1]) + '</strong> <span style="color:var(--text-light)">(' + fmt(pct, 0) + '%)</span></div>';
      }
    });
    d += '</div>';

    d += '<div style="margin-top:12px;padding:10px;background:#f1f5f9;border-radius:8px;font-size:0.9rem">';
    d += '<strong>Total Monthly Expenses: ' + fmtDollars(monthlyExpenses) + '</strong>';
    d += '</div>';

    // Progress bar
    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Progress to Goal</strong>';
    d += '<div style="margin-top:8px;background:#e5e7eb;border-radius:8px;height:24px;overflow:hidden;position:relative">';
    var barColor = progressPct >= 100 ? '#059669' : progressPct >= 50 ? '#d97706' : '#dc2626';
    d += '<div style="background:' + barColor + ';height:100%;width:' + Math.min(100, progressPct) + '%;border-radius:8px;transition:width 0.5s"></div>';
    d += '<div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:600;color:' + (progressPct > 50 ? '#fff' : '#374151') + '">' + fmt(progressPct, 0) + '% funded</div>';
    d += '</div>';
    d += '<div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-light);margin-top:4px">';
    d += '<span>' + fmtDollars(savings) + ' saved</span>';
    d += '<span>Goal: ' + fmtDollars(midTarget) + '</span>';
    d += '</div></div>';

    // Savings plan
    if (gap > 0) {
      d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
      d += '<strong style="font-size:0.95rem">Savings Plan</strong>';
      d += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:0.85rem;margin-top:8px">';

      var plans = [
        [100, 'Conservative'],
        [250, 'Moderate'],
        [500, 'Aggressive'],
        [750, 'Very Aggressive'],
        [1000, 'Maximum']
      ];

      // Include user's contribution if not already listed
      if (contrib > 0) {
        var found = plans.some(function(p) { return p[0] === contrib; });
        if (!found) {
          plans.push([contrib, 'Your plan']);
          plans.sort(function(a, b) { return a[0] - b[0]; });
        }
      }

      plans.forEach(function(p) {
        var months = Math.ceil(gap / p[0]);
        var isUserPlan = p[0] === contrib && contrib > 0;
        d += '<div style="padding:8px;background:' + (isUserPlan ? '#ecfdf5' : '#f9fafb') + ';border-radius:6px;' + (isUserPlan ? 'border:2px solid #059669;' : '') + '">';
        d += fmtDollars(p[0]) + '/mo<br>';
        d += '<strong>' + months + ' months</strong><br>';
        d += '<span style="font-size:0.75rem;color:var(--text-light)">' + fmt(months / 12, 1) + ' years</span>';
        d += '</div>';
      });

      d += '</div></div>';
    } else {
      d += '<div style="margin-top:16px;padding:12px;background:#ecfdf5;border-radius:8px;font-size:0.9rem;color:#065f46">';
      d += '<strong>Your emergency fund is fully funded!</strong> You have ' + fmtDollars(savings) + ' saved against a target of ' + fmtDollars(midTarget) + '. ';
      if (savings > highTarget) {
        d += 'You\'re above the recommended range — consider investing the excess for better returns.';
      } else {
        d += 'Consider keeping it in a high-yield savings account earning 4-5% APY.';
      }
      d += '</div>';
    }

    // Recommendation
    d += '<div style="margin-top:16px;padding:12px;background:#f1f5f9;border-radius:8px;font-size:0.85rem">';
    d += '<strong>Why ' + lowMonths + '-' + highMonths + ' months?</strong> ';
    if (stab === 'stable') {
      d += 'With stable employment, 3-6 months covers most emergencies including a typical job search.';
    } else if (stab === 'moderate') {
      d += 'With moderate employment stability, 6-9 months provides a buffer for a longer job search or industry downturn.';
    } else {
      d += 'With variable income, 9-12 months covers irregular earnings, seasonal dips, and client loss.';
    }
    if (deps > 0) {
      d += ' Added ' + deps + ' month(s) for ' + deps + ' dependent(s) — more people rely on this fund.';
    }
    d += '</div>';

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() {
    resultEl.classList.remove('visible');
    resultEl.style.display = 'none';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  var inputs = [rent, utilities, food, insurance, debt, other, currentSavings, monthlyContrib];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });
  stability.addEventListener('change', calculate);
  dependents.addEventListener('change', calculate);

})();
