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

  // State data: [rate%, redemptionMonths]
  var stateData = {
    'AZ': [16, 36], 'CO': [10, 36], 'FL': [18, 24], 'IL': [18, 36],
    'IN': [12, 12], 'IA': [24, 21], 'KY': [12, 12], 'MD': [12, 6],
    'MS': [18, 24], 'MO': [10, 12], 'MT': [10, 36], 'NE': [14, 36],
    'NJ': [18, 24], 'ND': [10, 36], 'OH': [18, 12], 'OK': [8, 12],
    'SC': [12, 12], 'SD': [12, 48], 'TX': [25, 6], 'VT': [12, 12],
    'WV': [12, 18], 'WY': [15, 48]
  };

  // DOM refs
  var stateSelect = document.getElementById('state');
  var lienAmount = document.getElementById('lienAmount');
  var interestRate = document.getElementById('interestRate');
  var redemptionPeriod = document.getElementById('redemptionPeriod');
  var purchasePremium = document.getElementById('purchasePremium');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rReturn = document.getElementById('rReturn');
  var rInterest = document.getElementById('rInterest');
  var rAnnual = document.getElementById('rAnnual');
  var rROI = document.getElementById('rROI');
  var resultDetails = document.getElementById('resultDetails');

  // Chart
  var chartData = [
    ['Arizona', '16%', '3 years', 'Bid down interest'],
    ['Florida', '18% (max)', '2 years', 'Bid down interest'],
    ['Illinois', '18%/6 mo', '2-3 years', 'Bid up premium'],
    ['Indiana', '10-15%', '1 year', 'Bid down interest'],
    ['Iowa', '24%', '1 year 9 mo', 'Bid up premium'],
    ['New Jersey', '18% (max)', '2 years', 'Bid down interest / premium'],
    ['Texas', '25-50% penalty', '6 mo-2 years', 'Bid up premium'],
    ['Ohio', '18%', '1 year', 'Bid down interest']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // Auto-fill rate/period when state changes
  stateSelect.addEventListener('change', function() {
    var st = stateSelect.value;
    if (st !== 'custom' && stateData[st]) {
      interestRate.value = stateData[st][0];
      redemptionPeriod.value = stateData[st][1];
    }
    calculate();
  });

  function getVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function calculate() {
    var lien = getVal(lienAmount);
    var rate = getVal(interestRate);
    var months = getVal(redemptionPeriod);
    var premium = getVal(purchasePremium);

    if (lien <= 0) { hideResult(); return; }

    var totalInvested = lien + premium;
    var interestEarned = lien * (rate / 100) * (months / 12);
    var totalReturn = lien + interestEarned;
    var profit = interestEarned - premium; // premium reduces profit
    var roiPct = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
    var annualizedReturn = months > 0 ? (roiPct / months) * 12 : 0;

    rReturn.textContent = fmtDollars(totalReturn);
    rInterest.textContent = fmtDollars(interestEarned);
    rInterest.style.color = '#059669';
    rAnnual.textContent = fmt(annualizedReturn, 1) + '%';
    rROI.textContent = fmt(roiPct, 1) + '%';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Lien Amount</strong><br>' + fmtDollars(lien) + '</div>';
    d += '<div><strong>Premium Paid</strong><br>' + fmtDollars(premium) + '</div>';
    d += '<div><strong>Total Cash Invested</strong><br>' + fmtDollars(totalInvested) + '</div>';
    d += '<div><strong>Hold Period</strong><br>' + fmt(months, 0) + ' months</div>';
    d += '<div><strong>Interest Earned</strong><br>' + fmtDollars(interestEarned) + '</div>';
    d += '<div><strong>Net Profit</strong><br><span style="color:' + (profit >= 0 ? '#059669' : '#dc2626') + '">' + fmtDollars(profit) + '</span></div>';
    d += '</div>';

    // Comparison to other investments
    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Comparison to Other Investments</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.85rem;margin-top:8px">';

    var comparisons = [
      ['This Tax Lien', annualizedReturn],
      ['High-Yield Savings', 4.5],
      ['10-Year Treasury', 4.2],
      ['S&P 500 Average', 10.0],
      ['Corporate Bonds', 5.5],
      ['CDs (1-year)', 4.8]
    ];
    comparisons.forEach(function(c) {
      var isThis = c[0] === 'This Tax Lien';
      d += '<div style="padding:8px;background:' + (isThis ? '#ecfdf5' : '#f9fafb') + ';border-radius:6px;' + (isThis ? 'font-weight:600;' : '') + '">';
      d += c[0] + ': ' + fmt(c[1], 1) + '%/yr';
      d += '</div>';
    });
    d += '</div></div>';

    // Risk assessment
    d += '<div style="margin-top:16px;padding:12px;border-radius:8px;font-size:0.9rem;';
    if (annualizedReturn >= 15) {
      d += 'background:#ecfdf5;color:#065f46"><strong>High Potential Return.</strong> ';
      d += 'At ' + fmt(annualizedReturn, 1) + '% annualized, this lien offers strong returns. Verify the property condition and title before investing.';
    } else if (annualizedReturn >= 8) {
      d += 'background:#fffbeb;color:#92400e"><strong>Moderate Return.</strong> ';
      d += 'At ' + fmt(annualizedReturn, 1) + '% annualized, this is competitive with stock market averages. Solid for a secured investment.';
    } else {
      d += 'background:#fef2f2;color:#991b1b"><strong>Low Return.</strong> ';
      d += 'At ' + fmt(annualizedReturn, 1) + '% annualized, consider whether the illiquidity and effort justify this over simpler fixed-income options.';
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

  var inputs = [lienAmount, interestRate, redemptionPeriod, purchasePremium];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
