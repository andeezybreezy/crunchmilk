(function() {
  'use strict';

  // IRS Uniform Lifetime Table (2024 updated)
  // Key: age, Value: life expectancy factor
  var uniformTable = {
    72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
    79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0,
    86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8,
    93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8,
    100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9, 105: 4.6, 106: 4.3,
    107: 4.1, 108: 3.9, 109: 3.7, 110: 3.5, 111: 3.4, 112: 3.3, 113: 3.1,
    114: 3.0, 115: 2.9, 116: 2.8, 117: 2.7, 118: 2.5, 119: 2.3, 120: 2.0
  };

  // Joint Life Expectancy Table (simplified - key ages when spouse is 10+ years younger)
  // Format: { ownerAge: { spouseAge: factor } }
  function getJointFactor(ownerAge, spouseAge) {
    // Simplified joint table approximation
    var diff = ownerAge - spouseAge;
    if (diff < 10) return uniformTable[ownerAge] || 20;
    var baseFactor = uniformTable[ownerAge] || 20;
    return baseFactor + (diff - 10) * 0.5 + 2;
  }

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtWhole(n) { return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var chartData = [
    ['73', '26.5', '3.77%', '$18,868', '$37,736'],
    ['75', '24.6', '4.07%', '$20,325', '$40,650'],
    ['78', '22.0', '4.55%', '$22,727', '$45,455'],
    ['80', '20.2', '4.95%', '$24,752', '$49,505'],
    ['85', '16.0', '6.25%', '$31,250', '$62,500'],
    ['90', '12.2', '8.20%', '$40,984', '$81,967'],
    ['95', '8.9', '11.24%', '$56,180', '$112,360']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  $('calcBtn').addEventListener('click', function() {
    var balance = parseFloat($('accountBalance').value) || 0;
    var age = parseInt($('age').value) || 0;
    var accountType = $('accountType').value;
    var spouseAge = parseInt($('spouseAge').value) || 0;
    var taxRate = parseFloat($('taxRate').value) || 0;

    if (balance <= 0 || age <= 0) return;

    // Determine RMD start age
    var rmdStartAge = age >= 60 ? 75 : 73; // Simplified SECURE 2.0 rule

    if (age < rmdStartAge && accountType !== 'inherited_ira') {
      $('rRmd').textContent = 'Not yet required';
      $('rFactor').textContent = 'Starts at age ' + rmdStartAge;
      $('rTax').textContent = '\u2014';
      $('rAfterTax').textContent = '\u2014';
      $('rMonthly').textContent = '\u2014';
      $('rDeadline').textContent = 'April 1 of year after turning ' + rmdStartAge;
      $('resultDetails').innerHTML = '<div style="padding:14px;background:#f0fdf4;border-radius:8px"><strong>No RMD required yet.</strong> You will begin taking RMDs at age ' + rmdStartAge + ' under SECURE 2.0. Consider Roth conversions now to reduce future RMDs.</div>';
      $('result').classList.add('visible');
      $('result').style.display = 'block';
      return;
    }

    // Get life expectancy factor
    var factor;
    var tableUsed;
    if (spouseAge > 0 && (age - spouseAge) >= 10) {
      factor = getJointFactor(age, spouseAge);
      tableUsed = 'Joint Life Table (spouse age ' + spouseAge + ')';
    } else {
      factor = uniformTable[age];
      tableUsed = 'Uniform Lifetime Table';
    }

    if (!factor) {
      factor = uniformTable[Math.min(age, 120)] || 2.0;
    }

    // Inherited IRA: 10-year rule for most non-spouse beneficiaries
    if (accountType === 'inherited_ira') {
      tableUsed = 'Single Life Table (inherited)';
      factor = Math.max(factor * 0.85, 1.0); // Inherited IRA uses different table, shorter
    }

    // RMD = balance / factor
    var rmd = balance / factor;
    var tax = rmd * (taxRate / 100);
    var afterTax = rmd - tax;
    var monthly = rmd / 12;

    // Deadline
    var currentYear = new Date().getFullYear();
    var deadline = 'December 31, ' + currentYear;
    if (age === rmdStartAge) {
      deadline = 'April 1, ' + (currentYear + 1) + ' (first RMD)';
    }

    $('rRmd').textContent = fmtWhole(rmd);
    $('rRmd').style.color = '#0d9488';
    $('rFactor').textContent = factor.toFixed(1);
    $('rTax').textContent = fmtWhole(tax);
    $('rTax').style.color = '#dc2626';
    $('rAfterTax').textContent = fmtWhole(afterTax);
    $('rAfterTax').style.color = '#059669';
    $('rMonthly').textContent = fmtWhole(monthly);
    $('rDeadline').textContent = deadline;
    $('rDeadline').style.fontSize = '0.85rem';

    var d = '';

    // Calculation breakdown
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>RMD Calculation</strong>';
    d += '<div style="margin-top:8px;font-size:0.9rem;line-height:1.7">';
    d += 'Account balance: ' + fmtWhole(balance) + '<br>';
    d += 'Your age: ' + age + '<br>';
    d += 'Table used: ' + tableUsed + '<br>';
    d += 'Life expectancy factor: ' + factor.toFixed(1) + '<br>';
    d += '<strong>RMD = ' + fmtWhole(balance) + ' \u00f7 ' + factor.toFixed(1) + ' = ' + fmtWhole(rmd) + '</strong>';
    d += '</div></div>';

    // 5-year projection
    d += '<div style="padding:14px;background:#f9fafb;border-radius:8px;margin-bottom:12px">';
    d += '<strong>5-Year RMD Projection</strong>';
    d += '<div style="font-size:0.8rem;color:var(--text-light);margin-bottom:4px">Assuming 5% annual growth, ' + taxRate + '% tax bracket</div>';
    d += '<table style="width:100%;font-size:0.85rem;border-collapse:collapse;margin-top:4px">';
    d += '<tr style="border-bottom:1px solid #e5e7eb"><th style="text-align:left;padding:4px">Year</th><th style="text-align:right;padding:4px">Balance</th><th style="text-align:right;padding:4px">RMD</th><th style="text-align:right;padding:4px">After Tax</th></tr>';

    var projBalance = balance;
    for (var y = 0; y < 5; y++) {
      var projAge = age + y;
      var projFactor = uniformTable[projAge] || factor - y * 0.8;
      if (projFactor < 1) projFactor = 1;
      var projRmd = projBalance / projFactor;
      var projAfterTax = projRmd * (1 - taxRate / 100);
      d += '<tr><td style="padding:4px">' + (currentYear + y) + ' (age ' + projAge + ')</td>';
      d += '<td style="text-align:right;padding:4px">' + fmtWhole(projBalance) + '</td>';
      d += '<td style="text-align:right;padding:4px">' + fmtWhole(projRmd) + '</td>';
      d += '<td style="text-align:right;padding:4px;color:#059669">' + fmtWhole(projAfterTax) + '</td></tr>';
      projBalance = (projBalance - projRmd) * 1.05;
    }
    d += '</table></div>';

    // Tax strategies
    d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-bottom:12px">';
    d += '<strong style="color:#059669">Tax Optimization Strategies</strong>';
    d += '<ul style="margin:8px 0 0 0;padding-left:20px;font-size:0.9rem;line-height:1.7">';
    d += '<li><strong>QCD (Qualified Charitable Distribution):</strong> Donate up to $105,000 directly from IRA to charity \u2014 satisfies RMD without adding to taxable income</li>';
    if (age < 75) {
      d += '<li><strong>Roth Conversions:</strong> Convert traditional IRA to Roth before age 75 to reduce future RMDs</li>';
    }
    d += '<li><strong>Timing:</strong> Take RMD early in the year to maximize growth in taxable accounts</li>';
    d += '<li><strong>Tax bracket management:</strong> If in a low-income year, consider taking extra beyond the RMD while in a lower bracket</li>';
    d += '</ul></div>';

    d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.85rem">';
    d += '<strong>Penalty reminder:</strong> Failure to take your full RMD results in a 25% excise tax on the shortfall. Set calendar reminders and consider automatic distributions. The deadline is December 31 each year (April 1 for your first RMD year only).';
    d += '</div>';

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
