(function() {
  'use strict';

  var schoolCosts = {
    publicIn: {name:'Public (In-State)', annual:22000, total:88000},
    publicOut: {name:'Public (Out-of-State)', annual:38000, total:152000},
    private: {name:'Private University', annual:52000, total:208000}
  };

  var majors = {
    cs: {name:'Computer Science', startSalary:80000, midSalary:125000, growth:0.05},
    engineering: {name:'Engineering', startSalary:75000, midSalary:120000, growth:0.045},
    business: {name:'Business', startSalary:55000, midSalary:95000, growth:0.04},
    healthcare: {name:'Healthcare/Nursing', startSalary:65000, midSalary:90000, growth:0.035},
    education: {name:'Education', startSalary:42000, midSalary:58000, growth:0.025},
    socialScience: {name:'Social Science', startSalary:45000, midSalary:70000, growth:0.03},
    arts: {name:'Arts/Humanities', startSalary:38000, midSalary:55000, growth:0.025}
  };

  var hsBaseSalary = 28000;
  var hsGrowth = 0.02;
  var opportunityCostPerYear = 28000;

  function fmt(n) { return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtD(n) { return (n<0?'-':'') + '$' + fmt(Math.abs(n)); }

  var chartData = [
    ['Computer Science','$80,000','$125,000','$32,000','245%'],
    ['Engineering','$75,000','$120,000','$33,000','220%'],
    ['Healthcare/Nursing','$65,000','$90,000','$30,000','180%'],
    ['Business','$55,000','$95,000','$35,000','115%'],
    ['Social Science','$45,000','$70,000','$32,000','55%'],
    ['Education','$42,000','$58,000','$29,000','35%'],
    ['Arts/Humanities','$38,000','$55,000','$34,000','15%']
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
    var schoolType = document.getElementById('schoolType').value;
    var majorCat = document.getElementById('majorCat').value;
    var customCost = parseFloat(document.getElementById('totalCost').value) || 0;
    var scholarships = parseFloat(document.getElementById('scholarships').value) || 0;
    var loanRate = parseFloat(document.getElementById('loanRate').value) / 100 || 0.065;

    var school = schoolCosts[schoolType];
    var major = majors[majorCat];
    var totalCost = customCost > 0 ? customCost : school.total;
    var netCost = Math.max(0, totalCost - scholarships);
    var opportunityCost = opportunityCostPerYear * 4;

    // Loan cost (10-year repayment)
    var monthlyRate = loanRate / 12;
    var numPayments = 120;
    var monthlyPayment = netCost > 0 ? (netCost * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1) : 0;
    var totalLoanCost = monthlyPayment * numPayments;
    var interestPaid = totalLoanCost - netCost;

    var totalTrueCost = totalLoanCost + opportunityCost;

    // 10-year earnings for college grad vs HS grad
    var collegeTenYear = 0, hsTenYear = 0;
    for (var y = 0; y < 10; y++) {
      collegeTenYear += major.startSalary * Math.pow(1 + major.growth, y);
      hsTenYear += hsBaseSalary * Math.pow(1 + hsGrowth, y + 4); // HS grad has 4 extra years of experience
    }

    // HS grad also earns during the 4 college years
    var hsExtraEarnings = 0;
    for (var y2 = 0; y2 < 4; y2++) {
      hsExtraEarnings += hsBaseSalary * Math.pow(1 + hsGrowth, y2);
    }

    var earningsPremium = collegeTenYear - hsTenYear;
    var netROI = earningsPremium - totalTrueCost;
    var roiPct = (netROI / totalTrueCost) * 100;

    // Payback period
    var cumulative = -totalTrueCost;
    var paybackYears = 'Never';
    for (var py = 0; py < 30; py++) {
      var collegeSalary = major.startSalary * Math.pow(1 + major.growth, py);
      var hsSalary = hsBaseSalary * Math.pow(1 + hsGrowth, py + 4);
      cumulative += (collegeSalary - hsSalary);
      if (cumulative >= 0) { paybackYears = (py + 1) + ' years'; break; }
    }

    // Trade school comparison
    var tradeSchoolCost = 18000;
    var tradeSalary = 55000;
    var tradeGrowth = 0.03;
    var tradeTenYear = 0;
    for (var t = 0; t < 10; t++) {
      tradeTenYear += tradeSalary * Math.pow(1 + tradeGrowth, t);
    }
    var tradeApprenticeEarnings = 20000 * 2 + 35000 * 2; // 4 years apprentice

    document.getElementById('rROI').textContent = roiPct.toFixed(0) + '%';
    document.getElementById('rROI').style.color = roiPct > 0 ? '#059669' : '#dc2626';
    document.getElementById('rPayback').textContent = paybackYears;
    document.getElementById('rCost').textContent = fmtD(Math.round(totalTrueCost));
    document.getElementById('rPremium').textContent = fmtD(Math.round(earningsPremium));
    document.getElementById('rPremium').style.color = earningsPremium > 0 ? '#059669' : '#dc2626';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">';

    d += '<div style="padding:12px;background:#eff6ff;border-radius:8px">';
    d += '<strong style="color:#2563eb">College Path: ' + major.name + '</strong><br>';
    d += 'School: ' + school.name + '<br>';
    d += 'Sticker price: ' + fmtD(totalCost) + '<br>';
    d += 'After scholarships: ' + fmtD(netCost) + '<br>';
    d += 'Interest paid: ' + fmtD(Math.round(interestPaid)) + '<br>';
    d += 'Opportunity cost: ' + fmtD(opportunityCost) + '<br>';
    d += '<strong>True cost: ' + fmtD(Math.round(totalTrueCost)) + '</strong><br>';
    d += 'Starting salary: ' + fmtD(major.startSalary) + '<br>';
    d += 'Monthly loan payment: ' + fmtD(Math.round(monthlyPayment)) + '/mo';
    d += '</div>';

    d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px">';
    d += '<strong style="color:#059669">Trade School Alternative</strong><br>';
    d += 'Training cost: ' + fmtD(tradeSchoolCost) + '<br>';
    d += 'Earn during apprenticeship: ' + fmtD(tradeApprenticeEarnings) + '<br>';
    d += 'Journeyman salary: ' + fmtD(tradeSalary) + '<br>';
    d += '10-year earnings: ' + fmtD(Math.round(tradeTenYear)) + '<br>';
    d += 'Student debt: $0<br>';
    d += '<strong>Net advantage: ' + (collegeTenYear > tradeTenYear + tradeApprenticeEarnings ? 'College by ' + fmtD(Math.round(collegeTenYear - tradeTenYear - tradeApprenticeEarnings + tradeSchoolCost - totalTrueCost)) : 'Trade by ' + fmtD(Math.round(tradeTenYear + tradeApprenticeEarnings - tradeSchoolCost - collegeTenYear + totalTrueCost))) + ' (10yr)</strong>';
    d += '</div></div>';

    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;font-size:0.9rem">';
    d += '<strong>10-Year Comparison</strong><br>';
    d += major.name + ' graduate: ' + fmtD(Math.round(collegeTenYear)) + ' total earnings<br>';
    d += 'High school graduate: ' + fmtD(Math.round(hsTenYear)) + ' total earnings (with 4 extra years experience)<br>';
    d += 'Earnings premium: ' + fmtD(Math.round(earningsPremium)) + '<br>';
    d += '<strong>Net ROI after all costs: ' + fmtD(Math.round(netROI)) + ' (' + roiPct.toFixed(0) + '%)</strong>';
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    var res = document.getElementById('result');
    res.classList.add('visible');
    res.style.display = 'block';
    res.scrollIntoView({behavior:'smooth',block:'nearest'});

    shareData = 'A ' + major.name + ' degree from a ' + school.name.toLowerCase() + ' has a ' + roiPct.toFixed(0) + '% ROI with a ' + paybackYears + ' payback period. Is YOUR degree worth it? ' + window.location.href;
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
