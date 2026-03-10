(function() {
  'use strict';

  function fmt(n) { return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtD(n) { return (n < 0 ? '-' : '') + '$' + fmt(Math.abs(n)); }

  var chartData = [
    ['62','$1,564','$1,204','-$4,320','N/A'],
    ['63','$1,680','$1,294','-$4,632','N/A'],
    ['64','$1,808','$1,392','-$4,992','N/A'],
    ['65','$1,948','$1,500','-$5,376','N/A'],
    ['67 (FRA)','$2,234','$1,720','-$6,168','80'],
    ['70','$2,770','$2,133','-$7,644','82']
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
    var age = parseInt(document.getElementById('currentAge').value) || 0;
    var retireAge = parseInt(document.getElementById('retireAge').value);
    var income = parseFloat(document.getElementById('annualIncome').value) || 0;
    var yearsWorked = parseInt(document.getElementById('yearsWorked').value) || 0;

    if (age < 18 || age > 70 || income <= 0) {
      alert('Please enter valid age (18-70) and income.');
      return;
    }

    var yearsToRetire = Math.max(0, retireAge - age);
    var totalYearsWorked = Math.min(yearsWorked + yearsToRetire, 45);
    var countableYears = Math.min(totalYearsWorked, 35);

    // Simplified AIME: average indexed monthly earnings
    var cappedIncome = Math.min(income, 168600);
    var aime = (cappedIncome * countableYears / 35) / 12;

    // 2026 bend points (approximate)
    var pia = 0;
    if (aime <= 1174) {
      pia = aime * 0.90;
    } else if (aime <= 7078) {
      pia = 1174 * 0.90 + (aime - 1174) * 0.32;
    } else {
      pia = 1174 * 0.90 + (7078 - 1174) * 0.32 + (aime - 7078) * 0.15;
    }

    // Adjust for retirement age
    var adjustmentFactor = 1.0;
    if (retireAge < 67) {
      var monthsEarly = (67 - retireAge) * 12;
      if (monthsEarly <= 36) {
        adjustmentFactor = 1 - (monthsEarly * 5/900);
      } else {
        adjustmentFactor = 1 - (36 * 5/900) - ((monthsEarly - 36) * 5/1200);
      }
    } else if (retireAge > 67) {
      var monthsLate = (retireAge - 67) * 12;
      adjustmentFactor = 1 + (monthsLate * 2/300);
    }

    var monthlyBenefit = pia * adjustmentFactor;
    var cutRate = 0.23;
    var trustDepletionYear = 2034;
    var currentYear = 2026;
    var retireYear = currentYear + yearsToRetire;

    var cutMonthly = monthlyBenefit * (1 - cutRate);
    var lifeExpectancy = 85;
    var yearsInRetirement = Math.max(0, lifeExpectancy - retireAge);

    // Years of reduced benefits (after 2034)
    var yearsReduced = 0;
    if (retireYear < trustDepletionYear) {
      yearsReduced = Math.max(0, lifeExpectancy - Math.max(retireAge, trustDepletionYear - currentYear + age));
    } else {
      yearsReduced = yearsInRetirement;
    }

    var lifetimeFull = monthlyBenefit * 12 * yearsInRetirement;
    var yearsAtFull = yearsInRetirement - yearsReduced;
    var lifetimeWithCuts = (monthlyBenefit * 12 * yearsAtFull) + (cutMonthly * 12 * yearsReduced);
    var lifetimeDiff = lifetimeFull - lifetimeWithCuts;

    document.getElementById('rBenefit').textContent = fmtD(Math.round(monthlyBenefit)) + '/mo';
    document.getElementById('rBenefit').style.color = '#059669';
    document.getElementById('rCutBenefit').textContent = fmtD(Math.round(cutMonthly)) + '/mo';
    document.getElementById('rCutBenefit').style.color = '#dc2626';
    document.getElementById('rLifetime').textContent = '-' + fmtD(Math.round(lifetimeDiff));
    document.getElementById('rLifetime').style.color = '#dc2626';
    document.getElementById('rYears').textContent = yearsReduced > 0 ? yearsReduced + ' years' : 'None';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">';
    d += '<div style="padding:12px;background:#eff6ff;border-radius:8px">';
    d += '<strong style="color:#1e40af">Current Law Scenario</strong><br>';
    d += 'Monthly: ' + fmtD(Math.round(monthlyBenefit)) + '<br>';
    d += 'Annual: ' + fmtD(Math.round(monthlyBenefit * 12)) + '<br>';
    d += 'Lifetime (to age ' + lifeExpectancy + '): ' + fmtD(Math.round(lifetimeFull));
    d += '</div>';
    d += '<div style="padding:12px;background:#fef2f2;border-radius:8px">';
    d += '<strong style="color:#dc2626">With Projected 23% Cut</strong><br>';
    d += 'Monthly: ' + fmtD(Math.round(cutMonthly)) + '<br>';
    d += 'Annual: ' + fmtD(Math.round(cutMonthly * 12)) + '<br>';
    d += 'Lifetime (to age ' + lifeExpectancy + '): ' + fmtD(Math.round(lifetimeWithCuts));
    d += '</div></div>';

    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Your Timeline</strong><br>';
    d += 'Years until retirement: ' + yearsToRetire + '<br>';
    d += 'Trust fund projected depletion: 2034 (' + (trustDepletionYear - currentYear) + ' years)<br>';
    d += 'Retirement age benefit adjustment: ' + (adjustmentFactor > 1 ? '+' : '') + ((adjustmentFactor - 1) * 100).toFixed(1) + '%<br>';
    d += 'Estimated AIME: ' + fmtD(Math.round(aime)) + '/mo (based on ' + countableYears + ' of 35 years)';
    d += '</div>';

    if (countableYears < 35) {
      d += '<div style="padding:10px;background:#fefce8;border-radius:8px;font-size:0.85rem;color:#854d0e">💡 You have ' + (35 - countableYears) + ' zero-earning years in your calculation. Each additional year of work will increase your benefit.</div>';
    }

    document.getElementById('resultDetails').innerHTML = d;
    var res = document.getElementById('result');
    res.classList.add('visible');
    res.style.display = 'block';
    res.scrollIntoView({behavior:'smooth',block:'nearest'});

    var cutPct = Math.round(cutRate * 100);
    shareData = 'According to the Social Security Calculator, my benefits could be reduced by ' + cutPct + '% by 2034 — losing ' + fmtD(Math.round(lifetimeDiff)) + ' over my lifetime. Check yours: ' + window.location.href;
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
