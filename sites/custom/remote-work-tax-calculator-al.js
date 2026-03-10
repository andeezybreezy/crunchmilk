(function() {
  'use strict';

  var stateData = {
    'AL': { name: 'Alabama', rate: 5.0, threshold: 30, noTax: false, convenience: false },
    'AK': { name: 'Alaska', rate: 0, threshold: 999, noTax: true, convenience: false },
    'AZ': { name: 'Arizona', rate: 2.5, threshold: 30, noTax: false, convenience: false },
    'AR': { name: 'Arkansas', rate: 4.4, threshold: 30, noTax: false, convenience: false },
    'CA': { name: 'California', rate: 13.3, threshold: 1, noTax: false, convenience: false },
    'CO': { name: 'Colorado', rate: 4.4, threshold: 30, noTax: false, convenience: false },
    'CT': { name: 'Connecticut', rate: 6.99, threshold: 1, noTax: false, convenience: true },
    'DE': { name: 'Delaware', rate: 6.6, threshold: 1, noTax: false, convenience: true },
    'FL': { name: 'Florida', rate: 0, threshold: 999, noTax: true, convenience: false },
    'GA': { name: 'Georgia', rate: 5.39, threshold: 30, noTax: false, convenience: false },
    'HI': { name: 'Hawaii', rate: 11.0, threshold: 60, noTax: false, convenience: false },
    'ID': { name: 'Idaho', rate: 5.695, threshold: 30, noTax: false, convenience: false },
    'IL': { name: 'Illinois', rate: 4.95, threshold: 30, noTax: false, convenience: false },
    'IN': { name: 'Indiana', rate: 3.05, threshold: 30, noTax: false, convenience: false },
    'IA': { name: 'Iowa', rate: 5.7, threshold: 30, noTax: false, convenience: false },
    'KS': { name: 'Kansas', rate: 5.7, threshold: 30, noTax: false, convenience: false },
    'KY': { name: 'Kentucky', rate: 4.0, threshold: 30, noTax: false, convenience: false },
    'LA': { name: 'Louisiana', rate: 4.25, threshold: 30, noTax: false, convenience: false },
    'ME': { name: 'Maine', rate: 7.15, threshold: 14, noTax: false, convenience: false },
    'MD': { name: 'Maryland', rate: 5.75, threshold: 30, noTax: false, convenience: false },
    'MA': { name: 'Massachusetts', rate: 5.0, threshold: 1, noTax: false, convenience: false },
    'MI': { name: 'Michigan', rate: 4.25, threshold: 30, noTax: false, convenience: false },
    'MN': { name: 'Minnesota', rate: 9.85, threshold: 14, noTax: false, convenience: false },
    'MS': { name: 'Mississippi', rate: 5.0, threshold: 30, noTax: false, convenience: false },
    'MO': { name: 'Missouri', rate: 4.8, threshold: 30, noTax: false, convenience: false },
    'MT': { name: 'Montana', rate: 6.75, threshold: 30, noTax: false, convenience: false },
    'NE': { name: 'Nebraska', rate: 5.84, threshold: 1, noTax: false, convenience: true },
    'NV': { name: 'Nevada', rate: 0, threshold: 999, noTax: true, convenience: false },
    'NH': { name: 'New Hampshire', rate: 0, threshold: 999, noTax: true, convenience: false },
    'NJ': { name: 'New Jersey', rate: 10.75, threshold: 1, noTax: false, convenience: true },
    'NM': { name: 'New Mexico', rate: 5.9, threshold: 30, noTax: false, convenience: false },
    'NY': { name: 'New York', rate: 10.9, threshold: 1, noTax: false, convenience: true },
    'NC': { name: 'North Carolina', rate: 4.5, threshold: 30, noTax: false, convenience: false },
    'ND': { name: 'North Dakota', rate: 2.5, threshold: 30, noTax: false, convenience: false },
    'OH': { name: 'Ohio', rate: 3.5, threshold: 30, noTax: false, convenience: false },
    'OK': { name: 'Oklahoma', rate: 4.75, threshold: 30, noTax: false, convenience: false },
    'OR': { name: 'Oregon', rate: 9.9, threshold: 30, noTax: false, convenience: false },
    'PA': { name: 'Pennsylvania', rate: 3.07, threshold: 1, noTax: false, convenience: true },
    'RI': { name: 'Rhode Island', rate: 5.99, threshold: 30, noTax: false, convenience: false },
    'SC': { name: 'South Carolina', rate: 6.4, threshold: 30, noTax: false, convenience: false },
    'SD': { name: 'South Dakota', rate: 0, threshold: 999, noTax: true, convenience: false },
    'TN': { name: 'Tennessee', rate: 0, threshold: 999, noTax: true, convenience: false },
    'TX': { name: 'Texas', rate: 0, threshold: 999, noTax: true, convenience: false },
    'UT': { name: 'Utah', rate: 4.65, threshold: 30, noTax: false, convenience: false },
    'VT': { name: 'Vermont', rate: 8.75, threshold: 30, noTax: false, convenience: false },
    'VA': { name: 'Virginia', rate: 5.75, threshold: 30, noTax: false, convenience: false },
    'WA': { name: 'Washington', rate: 0, threshold: 999, noTax: true, convenience: false },
    'WV': { name: 'West Virginia', rate: 6.5, threshold: 30, noTax: false, convenience: false },
    'WI': { name: 'Wisconsin', rate: 7.65, threshold: 30, noTax: false, convenience: false },
    'WY': { name: 'Wyoming', rate: 0, threshold: 999, noTax: true, convenience: false },
    'DC': { name: 'District of Columbia', rate: 10.75, threshold: 30, noTax: false, convenience: false }
  };

  var reciprocity = {
    'VA': ['DC', 'MD', 'WV', 'KY'],
    'DC': ['VA', 'MD'],
    'MD': ['VA', 'DC', 'PA', 'WV'],
    'PA': ['NJ', 'OH', 'IN', 'WV', 'VA', 'MD'],
    'NJ': ['PA'],
    'IL': ['IA', 'KY', 'MI', 'WI'],
    'IA': ['IL'],
    'KY': ['IL', 'IN', 'MI', 'OH', 'VA', 'WV', 'WI'],
    'MI': ['IL', 'IN', 'KY', 'MN', 'OH', 'WI'],
    'WI': ['IL', 'IN', 'KY', 'MI', 'MN'],
    'IN': ['KY', 'MI', 'OH', 'PA', 'WI'],
    'OH': ['IN', 'KY', 'MI', 'PA', 'WV'],
    'WV': ['KY', 'MD', 'OH', 'PA', 'VA'],
    'MN': ['MI', 'ND', 'WI'],
    'ND': ['MN', 'MT'],
    'MT': ['ND']
  };

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 0;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtD(n) { return '$' + fmt(Math.abs(n), 0); }

  function populateSelect(sel, selectedVal) {
    sel.innerHTML = '<option value="">— Select State —</option>';
    var codes = Object.keys(stateData).sort(function(a, b) {
      return stateData[a].name.localeCompare(stateData[b].name);
    });
    codes.forEach(function(code) {
      var opt = document.createElement('option');
      opt.value = code;
      opt.textContent = stateData[code].name;
      if (code === selectedVal) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  populateSelect(document.getElementById('homeState'));
  var firstWorkSelect = document.querySelector('.workStateSelect');
  if (firstWorkSelect) populateSelect(firstWorkSelect);

  document.getElementById('addStateBtn').addEventListener('click', function() {
    var list = document.getElementById('workStatesList');
    var row = document.createElement('div');
    row.className = 'work-state-row';
    row.style.cssText = 'display:grid;grid-template-columns:1fr 100px 40px;gap:8px;margin-bottom:8px;align-items:center';
    row.innerHTML = '<select class="workStateSelect" style="padding:10px 12px;border:2px solid var(--border);border-radius:8px;font-size:0.95rem;background:#fff"></select>' +
      '<input type="number" class="workStateDays" placeholder="Days" inputmode="decimal" step="1" style="padding:10px 12px;border:2px solid var(--border);border-radius:8px;font-size:0.95rem">' +
      '<button type="button" style="background:none;border:none;color:#dc2626;cursor:pointer;font-size:1.2rem;padding:0" onclick="this.parentElement.remove()">✕</button>';
    list.appendChild(row);
    populateSelect(row.querySelector('.workStateSelect'));
  });

  var chartData = [
    ['New York', '1 day*', '10.9%', 'Yes', 'Taxes remote workers of NY employers'],
    ['California', 'Fact-based', '13.3%', 'No', 'Aggressive sourcing rules'],
    ['Illinois', '30 days', '4.95%', 'No', 'Reciprocity with 4 states'],
    ['New Jersey', '1 day*', '10.75%', 'Yes', 'Convenience rule applies'],
    ['Pennsylvania', '1 day*', '3.07%', 'Yes', 'Low flat rate, reciprocity with 6 states'],
    ['Texas', 'N/A', '0%', 'No', 'No state income tax'],
    ['Florida', 'N/A', '0%', 'No', 'No state income tax']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var income = parseFloat(document.getElementById('annualIncome').value) || 0;
    var homeCode = document.getElementById('homeState').value;
    var homeDays = parseFloat(document.getElementById('homeDays').value) || 0;

    if (income <= 0 || !homeCode) return;

    var workStates = [];
    var rows = document.querySelectorAll('.work-state-row');
    rows.forEach(function(row) {
      var sel = row.querySelector('.workStateSelect');
      var daysInput = row.querySelector('.workStateDays');
      if (sel && daysInput && sel.value && parseFloat(daysInput.value) > 0) {
        workStates.push({ code: sel.value, days: parseFloat(daysInput.value) });
      }
    });

    var totalDays = homeDays;
    workStates.forEach(function(ws) { totalDays += ws.days; });
    if (totalDays <= 0) totalDays = 260;

    var homeData = stateData[homeCode];
    var results = [];
    var totalAdditionalTax = 0;
    var statesOwed = 0;

    // Home state always taxes full income
    var homeStateTax = income * (homeData.rate / 100);
    var totalCredits = 0;

    workStates.forEach(function(ws) {
      var sd = stateData[ws.code];
      if (!sd) return;

      var hasReciprocity = reciprocity[homeCode] && reciprocity[homeCode].indexOf(ws.code) !== -1;
      var aboveThreshold = ws.days >= sd.threshold;
      var taxableIncome = income * (ws.days / totalDays);
      var stateTax = taxableIncome * (sd.rate / 100);

      var entry = {
        code: ws.code,
        name: sd.name,
        days: ws.days,
        threshold: sd.threshold,
        rate: sd.rate,
        noTax: sd.noTax,
        convenience: sd.convenience,
        hasReciprocity: hasReciprocity,
        aboveThreshold: aboveThreshold,
        taxableIncome: taxableIncome,
        estimatedTax: stateTax,
        owes: false,
        reason: ''
      };

      if (sd.noTax) {
        entry.reason = 'No state income tax — no filing required.';
        entry.estimatedTax = 0;
      } else if (hasReciprocity) {
        entry.reason = 'Reciprocity agreement with ' + homeData.name + ' — file only in home state.';
        entry.estimatedTax = 0;
      } else if (aboveThreshold) {
        entry.owes = true;
        entry.reason = 'Exceeded ' + sd.threshold + '-day threshold. Nonresident filing likely required.';
        statesOwed++;
        totalCredits += stateTax;
      } else {
        entry.reason = 'Below ' + sd.threshold + '-day threshold (' + ws.days + ' days). Filing may not be required.';
        entry.estimatedTax = 0;
      }

      results.push(entry);
    });

    // Additional burden = taxes owed to other states minus credits from home state
    // In most cases home state gives credit, so additional burden is if work state rate > home state rate
    var additionalBurden = 0;
    results.forEach(function(r) {
      if (r.owes && r.rate > homeData.rate) {
        additionalBurden += r.taxableIncome * ((r.rate - homeData.rate) / 100);
      }
    });

    document.getElementById('rStates').textContent = (statesOwed + 1) + ' state' + (statesOwed > 0 ? 's' : '');
    document.getElementById('rBurden').textContent = additionalBurden > 0 ? '+' + fmtD(additionalBurden) : fmtD(0);
    if (additionalBurden > 0) {
      document.getElementById('rBurden').style.color = '#dc2626';
    } else {
      document.getElementById('rBurden').style.color = '#059669';
    }

    var d = '';
    d += '<div style="margin-bottom:16px">';
    d += '<div style="padding:12px;background:#eff6ff;border-radius:8px;border-left:4px solid #0369a1;margin-bottom:12px">';
    d += '<strong>' + homeData.name + ' (Home State)</strong><br>';
    d += 'Taxes full income at up to ' + homeData.rate + '%<br>';
    d += 'Estimated state tax: <strong>' + fmtD(homeStateTax) + '</strong><br>';
    d += '<span style="font-size:0.8rem;color:var(--text-light)">Credits applied for taxes paid to other states</span>';
    d += '</div>';
    d += '</div>';

    if (results.length > 0) {
      results.forEach(function(r) {
        var bg = r.owes ? '#fef2f2' : (r.noTax ? '#f0fdf4' : '#f9fafb');
        var border = r.owes ? '#dc2626' : (r.noTax || r.hasReciprocity ? '#059669' : '#9ca3af');
        d += '<div style="padding:12px;background:' + bg + ';border-radius:8px;border-left:4px solid ' + border + ';margin-bottom:8px">';
        d += '<strong>' + r.name + '</strong> — ' + r.days + ' days<br>';
        d += '<span style="font-size:0.85rem">' + r.reason + '</span><br>';
        if (r.owes) {
          d += 'Taxable income (apportioned): ' + fmtD(r.taxableIncome) + '<br>';
          d += 'Estimated nonresident tax: <strong style="color:#dc2626">' + fmtD(r.estimatedTax) + '</strong>';
          if (r.rate <= homeData.rate) {
            d += '<br><span style="font-size:0.8rem;color:#059669">Home state credit should offset this — no additional net burden.</span>';
          } else {
            d += '<br><span style="font-size:0.8rem;color:#dc2626">Rate exceeds home state — additional burden of ~' + fmtD(r.taxableIncome * ((r.rate - homeData.rate) / 100)) + '</span>';
          }
        }
        if (r.convenience) {
          d += '<br><span style="font-size:0.8rem;color:#b45309">⚠ Uses convenience-of-employer rule — may tax you even for remote days if employer is in this state.</span>';
        }
        d += '</div>';
      });
    }

    d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.8rem;margin-top:12px">';
    d += '<strong>Disclaimer:</strong> This is an estimate based on simplified state tax rules. Actual liability depends on your specific circumstances, filing status, deductions, and local taxes. Tax laws change frequently. Consult a tax professional for multi-state filing advice.';
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

})();
