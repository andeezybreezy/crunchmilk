(function() {
  'use strict';

  var trades = {
    electrician: {name:'Electrician',apprenticeHr:18,apprenticeYrs:5,journeyman:60000,masterPotential:85000,growth:0.03},
    plumber: {name:'Plumber',apprenticeHr:17,apprenticeYrs:5,journeyman:58000,masterPotential:82000,growth:0.03},
    hvac: {name:'HVAC Technician',apprenticeHr:16,apprenticeYrs:4,journeyman:52000,masterPotential:75000,growth:0.025},
    welder: {name:'Welder',apprenticeHr:17,apprenticeYrs:4,journeyman:48000,masterPotential:72000,growth:0.025},
    carpenter: {name:'Carpenter',apprenticeHr:15,apprenticeYrs:4,journeyman:50000,masterPotential:70000,growth:0.025}
  };

  var majors = {
    cs: {name:'Computer Science',startSalary:80000,growth:0.05},
    engineering: {name:'Engineering',startSalary:75000,growth:0.045},
    business: {name:'Business',startSalary:55000,growth:0.04},
    healthcare: {name:'Healthcare/Nursing',startSalary:65000,growth:0.035},
    education: {name:'Education',startSalary:42000,growth:0.025},
    arts: {name:'Arts/Humanities',startSalary:38000,growth:0.025}
  };

  function fmt(n) { return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtD(n) { return (n<0?'-':'') + '$' + fmt(Math.abs(n)); }

  var chartData = [
    ['Year 2','20','$56,000','-$50,000','+$106,000'],
    ['Year 4','22','$131,000','-$100,000','+$231,000'],
    ['Year 5','23','$186,000','-$55,000','+$241,000'],
    ['Year 10','28','$486,000','$225,000','+$261,000'],
    ['Year 15','33','$836,000','$575,000','+$261,000'],
    ['Year 20','38','$1,236,000','$1,025,000','+$211,000']
  ];
  var cb = document.getElementById('chartBody');
  if (cb) {
    chartData.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td>';
      cb.appendChild(tr);
    });
  }

  var shareData = '';

  document.getElementById('calcBtn').addEventListener('click', function() {
    var tradeKey = document.getElementById('trade').value;
    var majorKey = document.getElementById('major').value;
    var collegeCost = parseFloat(document.getElementById('collegeCost').value) || 100000;

    var trade = trades[tradeKey];
    var major = majors[majorKey];

    var tradeSchoolCost = 3000;
    var loanRate = 0.065;
    var loanTerm = 10;

    // Monthly student loan payment
    var monthlyRate = loanRate / 12;
    var numPayments = loanTerm * 12;
    var monthlyLoan = collegeCost > 0 ? (collegeCost * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1) : 0;
    var annualLoan = monthlyLoan * 12;
    var totalLoanCost = monthlyLoan * numPayments;

    // Calculate cumulative earnings at 5, 10, 20 years (from age 18)
    var milestones = [5, 10, 15, 20];
    var tradeEarnings = [];
    var collegeEarnings = [];

    for (var m = 0; m < milestones.length; m++) {
      var years = milestones[m];
      var tradeCum = -tradeSchoolCost;
      var collegeCum = -collegeCost;

      for (var y = 0; y < years; y++) {
        // Trade earnings
        if (y < trade.apprenticeYrs) {
          // Apprentice: hourly wage increasing each year
          var hrRate = trade.apprenticeHr + (y * 2);
          tradeCum += hrRate * 2080;
        } else {
          var tradeYearsPost = y - trade.apprenticeYrs;
          tradeCum += trade.journeyman * Math.pow(1 + trade.growth, tradeYearsPost);
        }

        // College earnings
        if (y < 4) {
          // In college: minimal earnings (part-time)
          collegeCum += 5000;
        } else {
          var collegeYearsPost = y - 4;
          var salary = major.startSalary * Math.pow(1 + major.growth, collegeYearsPost);
          var loanPay = collegeYearsPost < loanTerm ? annualLoan : 0;
          collegeCum += salary - loanPay;
        }
      }

      tradeEarnings.push(tradeCum);
      collegeEarnings.push(collegeCum);
    }

    // Find break-even year
    var breakEvenAge = 'Never';
    var tradeCumBE = -tradeSchoolCost;
    var collegeCumBE = -collegeCost;
    for (var by = 0; by < 40; by++) {
      if (by < trade.apprenticeYrs) {
        tradeCumBE += (trade.apprenticeHr + by * 2) * 2080;
      } else {
        tradeCumBE += trade.journeyman * Math.pow(1 + trade.growth, by - trade.apprenticeYrs);
      }
      if (by < 4) {
        collegeCumBE += 5000;
      } else {
        var cYrs = by - 4;
        var sal = major.startSalary * Math.pow(1 + major.growth, cYrs);
        var lp = cYrs < loanTerm ? annualLoan : 0;
        collegeCumBE += sal - lp;
      }
      if (collegeCumBE > tradeCumBE && breakEvenAge === 'Never') {
        breakEvenAge = 'Age ' + (18 + by);
        break;
      }
    }

    var winner20 = tradeEarnings[3] > collegeEarnings[3] ? trade.name : major.name;
    var diff20 = Math.abs(tradeEarnings[3] - collegeEarnings[3]);

    document.getElementById('rTrade10').textContent = fmtD(Math.round(tradeEarnings[1]));
    document.getElementById('rTrade10').style.color = tradeEarnings[1] > collegeEarnings[1] ? '#059669' : '';
    document.getElementById('rCollege10').textContent = fmtD(Math.round(collegeEarnings[1]));
    document.getElementById('rCollege10').style.color = collegeEarnings[1] > tradeEarnings[1] ? '#059669' : '';
    document.getElementById('rBreakeven').textContent = breakEvenAge;
    document.getElementById('rWinner').textContent = winner20 + ' by ' + fmtD(Math.round(diff20));
    document.getElementById('rWinner').style.color = tradeEarnings[3] > collegeEarnings[3] ? '#b45309' : '#2563eb';

    var d = '';
    d += '<div style="margin-bottom:16px"><strong>Cumulative Earnings Timeline (from age 18)</strong></div>';
    d += '<table style="width:100%;border-collapse:collapse;font-size:0.85rem;margin-bottom:16px">';
    d += '<tr style="background:#f3f4f6"><th style="padding:8px;text-align:left">Milestone</th><th style="padding:8px;text-align:right;color:#b45309">' + trade.name + '</th><th style="padding:8px;text-align:right;color:#2563eb">' + major.name + '</th><th style="padding:8px;text-align:right">Difference</th></tr>';
    for (var i = 0; i < milestones.length; i++) {
      var diff = tradeEarnings[i] - collegeEarnings[i];
      d += '<tr style="border-bottom:1px solid #f3f4f6">';
      d += '<td style="padding:8px">Year ' + milestones[i] + ' (age ' + (18 + milestones[i]) + ')</td>';
      d += '<td style="padding:8px;text-align:right;font-weight:600;color:#b45309">' + fmtD(Math.round(tradeEarnings[i])) + '</td>';
      d += '<td style="padding:8px;text-align:right;font-weight:600;color:#2563eb">' + fmtD(Math.round(collegeEarnings[i])) + '</td>';
      d += '<td style="padding:8px;text-align:right;color:' + (diff > 0 ? '#b45309' : '#2563eb') + '">' + (diff > 0 ? '+' : '') + fmtD(Math.round(diff)) + '</td>';
      d += '</tr>';
    }
    d += '</table>';

    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">';
    d += '<div style="padding:12px;background:#fffbeb;border-radius:8px">';
    d += '<strong style="color:#b45309">' + trade.name + ' Path</strong><br>';
    d += 'Training: ' + trade.apprenticeYrs + '-year apprenticeship<br>';
    d += 'Training cost: ' + fmtD(tradeSchoolCost) + '<br>';
    d += 'Apprentice wage: $' + trade.apprenticeHr + '-' + (trade.apprenticeHr + trade.apprenticeYrs * 2) + '/hr<br>';
    d += 'Journeyman salary: ' + fmtD(trade.journeyman) + '<br>';
    d += 'Master potential: ' + fmtD(trade.masterPotential) + '<br>';
    d += 'Student debt: <strong style="color:#059669">$0</strong>';
    d += '</div>';

    d += '<div style="padding:12px;background:#eff6ff;border-radius:8px">';
    d += '<strong style="color:#2563eb">' + major.name + ' Path</strong><br>';
    d += 'Training: 4-year degree<br>';
    d += 'Total cost: ' + fmtD(collegeCost) + '<br>';
    d += 'Loan payment: ' + fmtD(Math.round(monthlyLoan)) + '/mo for 10 yrs<br>';
    d += 'Total loan cost: ' + fmtD(Math.round(totalLoanCost)) + '<br>';
    d += 'Starting salary: ' + fmtD(major.startSalary) + '<br>';
    d += 'Student debt: <strong style="color:#dc2626">' + fmtD(collegeCost) + '</strong>';
    d += '</div></div>';

    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;font-size:0.9rem">';
    if (breakEvenAge === 'Never') {
      d += '<strong>The ' + trade.name + ' path never falls behind the ' + major.name + ' path over 40 years.</strong>';
    } else {
      d += '<strong>The ' + major.name + ' path catches up at ' + breakEvenAge + '</strong> — that\'s when the college grad\'s higher salary overcomes the trade worker\'s head start.';
    }
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    var res = document.getElementById('result');
    res.classList.add('visible');
    res.style.display = 'block';
    res.scrollIntoView({behavior:'smooth',block:'nearest'});

    shareData = 'An ' + trade.name + ' earns ' + fmtD(Math.round(tradeEarnings[1])) + ' in their first 10 years vs ' + fmtD(Math.round(collegeEarnings[1])) + ' for a ' + major.name + ' grad. Compare paths: ' + window.location.href;
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
