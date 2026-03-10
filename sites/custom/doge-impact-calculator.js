(function() {
  'use strict';

  var states = {
    'Alabama': {dep:0.42,fedEmp:38000,pop:5025000}, 'Alaska': {dep:0.38,fedEmp:16000,pop:733000},
    'Arizona': {dep:0.36,fedEmp:48000,pop:7278000}, 'Arkansas': {dep:0.40,fedEmp:17000,pop:3012000},
    'California': {dep:0.30,fedEmp:174000,pop:39538000}, 'Colorado': {dep:0.31,fedEmp:55000,pop:5774000},
    'Connecticut': {dep:0.26,fedEmp:13000,pop:3606000}, 'Delaware': {dep:0.32,fedEmp:5000,pop:990000},
    'Florida': {dep:0.33,fedEmp:96000,pop:21538000}, 'Georgia': {dep:0.35,fedEmp:78000,pop:10712000},
    'Hawaii': {dep:0.36,fedEmp:27000,pop:1455000}, 'Idaho': {dep:0.37,fedEmp:12000,pop:1868000},
    'Illinois': {dep:0.30,fedEmp:55000,pop:12812000}, 'Indiana': {dep:0.34,fedEmp:28000,pop:6732000},
    'Iowa': {dep:0.32,fedEmp:12000,pop:3190000}, 'Kansas': {dep:0.33,fedEmp:23000,pop:2937000},
    'Kentucky': {dep:0.41,fedEmp:26000,pop:4506000}, 'Louisiana': {dep:0.40,fedEmp:24000,pop:4657000},
    'Maine': {dep:0.38,fedEmp:11000,pop:1362000}, 'Maryland': {dep:0.35,fedEmp:145000,pop:6177000},
    'Massachusetts': {dep:0.28,fedEmp:30000,pop:7030000}, 'Michigan': {dep:0.34,fedEmp:33000,pop:10077000},
    'Minnesota': {dep:0.29,fedEmp:20000,pop:5707000}, 'Mississippi': {dep:0.45,fedEmp:19000,pop:2961000},
    'Missouri': {dep:0.36,fedEmp:42000,pop:6155000}, 'Montana': {dep:0.39,fedEmp:10000,pop:1085000},
    'Nebraska': {dep:0.31,fedEmp:14000,pop:1962000}, 'Nevada': {dep:0.31,fedEmp:14000,pop:3104000},
    'New Hampshire': {dep:0.27,fedEmp:5000,pop:1377000}, 'New Jersey': {dep:0.27,fedEmp:36000,pop:9289000},
    'New Mexico': {dep:0.43,fedEmp:28000,pop:2118000}, 'New York': {dep:0.31,fedEmp:72000,pop:20202000},
    'North Carolina': {dep:0.34,fedEmp:60000,pop:10439000}, 'North Dakota': {dep:0.35,fedEmp:7000,pop:779000},
    'Ohio': {dep:0.35,fedEmp:54000,pop:11799000}, 'Oklahoma': {dep:0.38,fedEmp:37000,pop:3960000},
    'Oregon': {dep:0.32,fedEmp:25000,pop:4238000}, 'Pennsylvania': {dep:0.33,fedEmp:67000,pop:13003000},
    'Rhode Island': {dep:0.34,fedEmp:8000,pop:1098000}, 'South Carolina': {dep:0.37,fedEmp:29000,pop:5119000},
    'South Dakota': {dep:0.38,fedEmp:9000,pop:887000}, 'Tennessee': {dep:0.37,fedEmp:36000,pop:6910000},
    'Texas': {dep:0.32,fedEmp:146000,pop:29145000}, 'Utah': {dep:0.31,fedEmp:30000,pop:3272000},
    'Vermont': {dep:0.36,fedEmp:4000,pop:643000}, 'Virginia': {dep:0.35,fedEmp:185000,pop:8631000},
    'Washington': {dep:0.30,fedEmp:63000,pop:7615000}, 'West Virginia': {dep:0.44,fedEmp:14000,pop:1793000},
    'Wisconsin': {dep:0.31,fedEmp:18000,pop:5894000}, 'Wyoming': {dep:0.37,fedEmp:6000,pop:577000}
  };

  var programCuts = {
    snap: {name:'SNAP',cutLow:0.25,cutHigh:0.30,avgBenefit:3024},
    medicaid: {name:'Medicaid',cutLow:0.15,cutHigh:0.25,avgBenefit:7200},
    va: {name:'VA Benefits',cutLow:0.10,cutHigh:0.15,avgBenefit:18900},
    ss: {name:'Social Security',cutLow:0.03,cutHigh:0.05,avgBenefit:21924},
    fedJob: {name:'Federal Employment',cutLow:0.15,cutHigh:0.25,avgSalary:85000},
    edu: {name:'Education Grants',cutLow:0.20,cutHigh:0.30,avgBenefit:6500}
  };

  var sel = document.getElementById('stateSelect');
  var opt0 = document.createElement('option');
  opt0.value = '';
  opt0.textContent = '— Select State —';
  sel.appendChild(opt0);
  Object.keys(states).sort().forEach(function(s) {
    var o = document.createElement('option');
    o.value = s;
    o.textContent = s;
    sel.appendChild(o);
  });

  function fmt(n) {
    return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function fmtD(n) {
    var s = n < 0 ? '-' : '';
    return s + '$' + fmt(Math.abs(n));
  }

  var chartData = [
    ['SNAP', '25-30%', '$119B', '$30-36B', '42 million'],
    ['Medicaid', '15-25%', '$616B', '$92-154B', '85 million'],
    ['VA Benefits', '10-15%', '$301B', '$30-45B', '9 million'],
    ['Social Security (admin)', '10-20%', '$1.4T', '$6-12B admin', '67 million'],
    ['Federal Workforce', '15-25%', '$280B payroll', '$42-70B', '2.2 million'],
    ['Education Grants', '20-30%', '$79B', '$16-24B', '12 million']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  var shareData = '';

  document.getElementById('calcBtn').addEventListener('click', function() {
    var state = sel.value;
    var income = parseFloat(document.getElementById('householdIncome').value) || 0;
    var deps = parseInt(document.getElementById('dependents').value) || 0;
    if (!state) { alert('Please select a state.'); return; }

    var sd = states[state];
    var checks = {
      snap: document.getElementById('bSnap').checked,
      medicaid: document.getElementById('bMedicaid').checked,
      va: document.getElementById('bVA').checked,
      ss: document.getElementById('bSS').checked,
      fedJob: document.getElementById('bFedJob').checked,
      edu: document.getElementById('bEdu').checked
    };

    var totalLow = 0, totalHigh = 0;
    var affected = [];
    var breakdownHTML = '';

    Object.keys(checks).forEach(function(key) {
      if (!checks[key]) return;
      var p = programCuts[key];
      var base = key === 'fedJob' ? p.avgSalary : p.avgBenefit;
      if (key === 'snap') base = base * (1 + deps * 0.35);
      if (key === 'medicaid') base = base * (1 + deps * 0.5);
      if (key === 'edu') base = base * Math.max(1, deps);
      var low = base * p.cutLow;
      var high = base * p.cutHigh;
      totalLow += low;
      totalHigh += high;
      affected.push(p.name);
      breakdownHTML += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6"><span>' + p.name + '</span><span style="color:#dc2626;font-weight:600">-' + fmtD(low) + ' to -' + fmtD(high) + '/yr</span></div>';
    });

    var stateBudgetEst = sd.dep * sd.pop * 3500;
    var stateAtRisk = stateBudgetEst * 0.20;
    var depScore = (sd.dep * 100).toFixed(0);

    var midImpact = (totalLow + totalHigh) / 2;

    document.getElementById('rImpact').textContent = totalHigh > 0 ? ('-' + fmtD(totalLow) + ' to -' + fmtD(totalHigh)) : '$0';
    document.getElementById('rImpact').style.color = totalHigh > 0 ? '#dc2626' : '';
    document.getElementById('rStateFund').textContent = '$' + (stateAtRisk / 1e9).toFixed(1) + 'B at risk';
    document.getElementById('rPrograms').textContent = affected.length > 0 ? affected.join(', ') : 'None selected';
    document.getElementById('rDependency').textContent = depScore + '% federal dependent';

    var d = '';
    if (breakdownHTML) {
      d += '<div style="margin-bottom:16px"><strong>Household Impact Breakdown</strong>' + breakdownHTML + '</div>';
      d += '<div style="padding:12px;background:#fef2f2;border-radius:8px;margin-bottom:12px">';
      d += '<strong>Total estimated annual impact: -' + fmtD(totalLow) + ' to -' + fmtD(totalHigh) + '</strong>';
      if (income > 0) {
        d += '<br>That\'s ' + ((midImpact / income) * 100).toFixed(1) + '% of your household income';
      }
      d += '</div>';
    }
    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px">';
    d += '<strong>' + state + ' Federal Dependency</strong><br>';
    d += 'Federal share of state budget: ~' + depScore + '%<br>';
    d += 'Federal employees in state: ~' + fmt(sd.fedEmp) + '<br>';
    d += 'Estimated state funding at risk: $' + (stateAtRisk / 1e9).toFixed(1) + 'B';
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    var res = document.getElementById('result');
    res.classList.add('visible');
    res.style.display = 'block';
    res.scrollIntoView({behavior:'smooth',block:'nearest'});

    shareData = 'According to the DOGE Impact Calculator, my household in ' + state + ' could lose ' + fmtD(totalLow) + ' to ' + fmtD(totalHigh) + '/year from proposed federal cuts. Check yours: ' + window.location.href;
  });

  document.getElementById('shareBtn').addEventListener('click', function() {
    if (!shareData) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData).then(function() {
        var btn = document.getElementById('shareBtn');
        btn.textContent = '✓ Copied to clipboard!';
        setTimeout(function() { btn.textContent = '📋 Share Your Result'; }, 2000);
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = shareData;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      var btn = document.getElementById('shareBtn');
      btn.textContent = '✓ Copied to clipboard!';
      setTimeout(function() { btn.textContent = '📋 Share Your Result'; }, 2000);
    }
  });

})();
