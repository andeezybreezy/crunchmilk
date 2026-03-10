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

  // 2026 estimated brackets (based on current law + inflation adjustments)
  var brackets = {
    single: {
      standardDeduction: 15700,
      rates: [
        { rate: 0.10, min: 0, max: 11925 },
        { rate: 0.12, min: 11925, max: 48475 },
        { rate: 0.22, min: 48475, max: 103350 },
        { rate: 0.24, min: 103350, max: 197300 },
        { rate: 0.32, min: 197300, max: 250525 },
        { rate: 0.35, min: 250525, max: 626350 },
        { rate: 0.37, min: 626350, max: Infinity }
      ]
    },
    married: {
      standardDeduction: 31400,
      rates: [
        { rate: 0.10, min: 0, max: 23850 },
        { rate: 0.12, min: 23850, max: 96950 },
        { rate: 0.22, min: 96950, max: 206700 },
        { rate: 0.24, min: 206700, max: 394600 },
        { rate: 0.32, min: 394600, max: 501050 },
        { rate: 0.35, min: 501050, max: 751600 },
        { rate: 0.37, min: 751600, max: Infinity }
      ]
    },
    hoh: {
      standardDeduction: 23500,
      rates: [
        { rate: 0.10, min: 0, max: 17000 },
        { rate: 0.12, min: 17000, max: 64850 },
        { rate: 0.22, min: 64850, max: 103350 },
        { rate: 0.24, min: 103350, max: 197300 },
        { rate: 0.32, min: 197300, max: 250500 },
        { rate: 0.35, min: 250500, max: 626350 },
        { rate: 0.37, min: 626350, max: Infinity }
      ]
    }
  };

  // DOM refs
  var filingStatus = document.getElementById('filingStatus');
  var grossIncome = document.getElementById('grossIncome');
  var itemizedAmount = document.getElementById('itemizedAmount');
  var otherIncome = document.getElementById('otherIncome');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rMarginal = document.getElementById('rMarginal');
  var rEffective = document.getElementById('rEffective');
  var rTax = document.getElementById('rTax');
  var rTakeHome = document.getElementById('rTakeHome');
  var resultDetails = document.getElementById('resultDetails');

  var deductionMode = 'standard';

  // Deduction toggle
  var deductionToggle = document.getElementById('deductionToggle');
  var toggleBtns = deductionToggle.querySelectorAll('button');
  var itemizedInput = document.getElementById('itemizedInput');

  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      deductionMode = btn.dataset.mode;
      itemizedInput.style.display = deductionMode === 'itemized' ? '' : 'none';
      calculate();
    });
  });

  // Chart
  var chartData = [
    ['10%', '$0 – $11,925', '$0 – $23,850', '$0 – $17,000'],
    ['12%', '$11,926 – $48,475', '$23,851 – $96,950', '$17,001 – $64,850'],
    ['22%', '$48,476 – $103,350', '$96,951 – $206,700', '$64,851 – $103,350'],
    ['24%', '$103,351 – $197,300', '$206,701 – $394,600', '$103,351 – $197,300'],
    ['32%', '$197,301 – $250,525', '$394,601 – $501,050', '$197,301 – $250,500'],
    ['35%', '$250,526 – $626,350', '$501,051 – $751,600', '$250,501 – $626,350'],
    ['37%', 'Over $626,350', 'Over $751,600', 'Over $626,350']
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

  function calculate() {
    var gross = getVal(grossIncome);
    var status = filingStatus.value;
    var retirement = getVal(otherIncome);

    if (gross <= 0) { hideResult(); return; }

    var bracketData = brackets[status];
    var deduction;
    if (deductionMode === 'standard') {
      deduction = bracketData.standardDeduction;
    } else {
      deduction = getVal(itemizedAmount);
    }

    var taxableIncome = Math.max(0, gross - deduction - retirement);

    // Calculate tax by bracket
    var totalTax = 0;
    var marginalRate = 0;
    var bracketBreakdown = [];

    bracketData.rates.forEach(function(b) {
      if (taxableIncome <= b.min) return;
      var taxableInBracket = Math.min(taxableIncome, b.max) - b.min;
      var taxInBracket = taxableInBracket * b.rate;
      totalTax += taxInBracket;
      marginalRate = b.rate;
      bracketBreakdown.push({
        rate: b.rate,
        income: taxableInBracket,
        tax: taxInBracket,
        min: b.min,
        max: b.max
      });
    });

    var effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;
    var ficaTax = Math.min(gross, 168600) * 0.062 + gross * 0.0145; // SS + Medicare
    var additionalMedicare = gross > 200000 ? (gross - 200000) * 0.009 : 0;
    ficaTax += additionalMedicare;
    var takeHome = gross - totalTax - ficaTax - retirement;

    rMarginal.textContent = (marginalRate * 100) + '%';
    rEffective.textContent = fmt(effectiveRate, 1) + '%';
    rTax.textContent = fmtDollars(totalTax);
    rTakeHome.textContent = fmtDollars(takeHome);
    rTakeHome.style.color = '#059669';

    var d = '';

    // Income summary
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Gross Income</strong><br>' + fmtDollars(gross) + '</div>';
    d += '<div><strong>Deduction</strong><br>' + fmtDollars(deduction) + ' (' + (deductionMode === 'standard' ? 'standard' : 'itemized') + ')</div>';
    if (retirement > 0) {
      d += '<div><strong>Pre-Tax Contributions</strong><br>-' + fmtDollars(retirement) + '</div>';
    }
    d += '<div><strong>Taxable Income</strong><br>' + fmtDollars(taxableIncome) + '</div>';
    d += '</div>';

    // Bracket breakdown
    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Tax by Bracket</strong>';
    d += '<div style="margin-top:8px">';

    bracketBreakdown.forEach(function(b) {
      var widthPct = taxableIncome > 0 ? (b.income / taxableIncome) * 100 : 0;
      var colors = {
        0.10: '#dcfce7', 0.12: '#bbf7d0', 0.22: '#fef9c3',
        0.24: '#fed7aa', 0.32: '#fecaca', 0.35: '#fca5a5', 0.37: '#f87171'
      };
      var bg = colors[b.rate] || '#e5e7eb';

      d += '<div style="margin-bottom:6px">';
      d += '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:2px">';
      d += '<span><strong>' + (b.rate * 100) + '%</strong> on ' + fmtDollars(b.income) + '</span>';
      d += '<span>' + fmtDollars(b.tax) + '</span>';
      d += '</div>';
      d += '<div style="background:#e5e7eb;border-radius:4px;height:8px;overflow:hidden">';
      d += '<div style="background:' + bg + ';height:100%;width:' + Math.max(2, widthPct) + '%;border-radius:4px;border:1px solid rgba(0,0,0,0.1)"></div>';
      d += '</div></div>';
    });

    d += '<div style="display:flex;justify-content:space-between;font-size:0.9rem;font-weight:600;margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb">';
    d += '<span>Federal Income Tax</span><span>' + fmtDollars(totalTax) + '</span></div>';
    d += '</div></div>';

    // Full tax picture
    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Full Tax Picture (Federal Only)</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.85rem;margin-top:8px">';
    d += '<div style="padding:8px;background:#f9fafb;border-radius:6px">Federal Income Tax<br><strong>' + fmtDollars(totalTax) + '</strong></div>';
    d += '<div style="padding:8px;background:#f9fafb;border-radius:6px">FICA (SS + Medicare)<br><strong>' + fmtDollars(ficaTax) + '</strong></div>';
    if (retirement > 0) {
      d += '<div style="padding:8px;background:#f9fafb;border-radius:6px">Pre-Tax Contributions<br><strong>' + fmtDollars(retirement) + '</strong></div>';
    }
    d += '<div style="padding:8px;background:#ecfdf5;border-radius:6px">Take-Home Pay<br><strong style="color:#059669">' + fmtDollars(takeHome) + '</strong><br><span style="font-size:0.8rem;color:var(--text-light)">' + fmtDollars(takeHome / 12) + '/month</span></div>';
    d += '</div>';

    var totalFedTax = totalTax + ficaTax;
    var totalFedRate = gross > 0 ? (totalFedTax / gross) * 100 : 0;
    d += '<div style="margin-top:8px;font-size:0.85rem;color:var(--text-light)">';
    d += 'Total federal tax burden: ' + fmtDollars(totalFedTax) + ' (' + fmt(totalFedRate, 1) + '% of gross). State taxes not included.';
    d += '</div></div>';

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

  var inputs = [grossIncome, itemizedAmount, otherIncome];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });
  filingStatus.addEventListener('change', calculate);

})();
