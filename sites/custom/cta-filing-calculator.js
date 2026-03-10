(function() {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  // Filing costs by method and complexity: [simple, moderate, complex]
  var methodCosts = {
    diy:      [0, 0, 0],
    service:  [75, 149, 299],
    attorney: [350, 1000, 3000]
  };

  // Time estimates (minutes)
  var methodTime = {
    diy:      [20, 45, 90],
    service:  [15, 25, 40],
    attorney: [10, 15, 20]  // Your time only (attorney does the work)
  };

  var chartData = [
    ['DIY (FinCEN direct)', '$0', '$0', '$0', '15\u201360 min', 'Simple 1-2 owners'],
    ['Online Filing Service', '$49\u201399', '$99\u2013199', '$199\u2013399', '20\u201330 min', 'Multiple entities'],
    ['CPA / Bookkeeper', '$100\u2013250', '$200\u2013500', '$500\u20131,000', '1\u20135 days', 'Existing client'],
    ['Attorney', '$200\u2013500', '$500\u20131,500', '$1,500\u20135,000', '1\u20132 weeks', 'Complex structures'],
    ['Registered Agent Service', '$75\u2013150', '$150\u2013300', '$300\u2013600', '1\u20133 days', 'Bundle with RA']
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
    var entityType = $('entityType').value;
    var formationDate = $('formationDate').value;
    var numOwners = parseInt($('numOwners').value) || 1;
    var filingMethod = $('filingMethod').value;
    var complexity = $('complexity').value;
    var numEntities = parseInt($('numEntities').value) || 1;

    // Complexity index
    var compIdx = { simple: 0, moderate: 1, complex: 2 };
    var ci = compIdx[complexity];

    // Base cost per entity
    var baseCost = methodCosts[filingMethod][ci];

    // Additional owner surcharge for attorney
    if (filingMethod === 'attorney' && numOwners > 2) {
      baseCost += (numOwners - 2) * (ci === 2 ? 200 : 100);
    }

    // Per-entity cost
    var perEntity = baseCost;
    // Volume discount for multiple entities
    if (numEntities > 5) perEntity *= 0.80;
    else if (numEntities > 2) perEntity *= 0.90;

    var totalCost = perEntity * numEntities;

    // Time estimate
    var timeMinutes = methodTime[filingMethod][ci] * numEntities;
    var timeStr = '';
    if (timeMinutes < 60) timeStr = timeMinutes + ' minutes';
    else if (timeMinutes < 480) timeStr = (timeMinutes / 60).toFixed(1) + ' hours';
    else timeStr = Math.ceil(timeMinutes / 480) + ' business day(s)';

    // Deadline
    var deadline = '';
    if (formationDate === 'before2024') {
      deadline = 'Jan 1, 2025 (check for extensions)';
    } else if (formationDate === 'in2024') {
      deadline = '90 days from formation';
    } else {
      deadline = '30 days from formation';
    }

    // Penalty
    var penaltyStr = 'Up to $500/day (max $10,000)';

    // Recommendation
    var recommend = '';
    if (complexity === 'simple' && numOwners <= 2) {
      recommend = 'DIY is fine';
    } else if (complexity === 'moderate') {
      recommend = 'Filing service or CPA';
    } else {
      recommend = 'Use an attorney';
    }

    $('rCost').textContent = totalCost > 0 ? fmt(totalCost) : 'Free (DIY)';
    $('rDeadline').textContent = deadline;
    $('rDeadline').style.fontSize = '0.8rem';
    $('rTime').textContent = timeStr;
    $('rPenalty').textContent = penaltyStr;
    $('rPenalty').style.color = '#dc2626';
    $('rPenalty').style.fontSize = '0.8rem';
    $('rTotal').textContent = numEntities > 1 ? fmt(totalCost) + ' (' + numEntities + ' entities)' : fmt(totalCost);
    $('rRecommend').textContent = recommend;
    $('rRecommend').style.fontSize = '0.85rem';

    var d = '';

    // What you need
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Information Needed for Filing</strong>';
    d += '<ul style="margin:8px 0 0 0;padding-left:20px;font-size:0.9rem;line-height:1.7">';
    d += '<li><strong>Company info:</strong> Legal name, DBA/trade names, address, state of formation, EIN</li>';
    d += '<li><strong>For each beneficial owner (' + numOwners + '):</strong></li>';
    d += '<ul style="padding-left:20px">';
    d += '<li>Full legal name and date of birth</li>';
    d += '<li>Current residential address (not PO Box)</li>';
    d += '<li>Driver\'s license or passport number + image</li>';
    d += '</ul>';
    if (formationDate === 'after2024') {
      d += '<li><strong>Company applicant info:</strong> Person who filed the formation document</li>';
    }
    d += '</ul></div>';

    // Cost comparison
    if (filingMethod !== 'diy') {
      d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-bottom:12px">';
      d += '<strong>Cost vs DIY</strong><br>';
      d += '<span style="font-size:0.9rem">Filing directly with FinCEN is free. You are paying ' + fmt(totalCost) + ' for convenience';
      if (complexity !== 'simple') {
        d += ' and professional guidance to ensure accuracy with your ' + complexity + ' ownership structure';
      }
      d += '. ';
      if (complexity === 'simple') {
        d += 'For a simple entity with ' + numOwners + ' owner(s), DIY is straightforward and takes about 15-30 minutes.';
      }
      d += '</span></div>';
    }

    // Exemptions check
    d += '<div style="padding:14px;background:#f9fafb;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Check If You Are Exempt</strong>';
    d += '<div style="margin-top:8px;font-size:0.9rem;line-height:1.7">';
    d += 'You may be exempt from BOI reporting if your entity:<br>';
    d += '<ul style="margin:4px 0 0 0;padding-left:20px">';
    d += '<li>Has 20+ full-time employees AND $5M+ gross revenue AND a physical US office</li>';
    d += '<li>Is a bank, credit union, insurance company, or SEC-registered entity</li>';
    d += '<li>Is a tax-exempt nonprofit (501(c))</li>';
    d += '<li>Is an inactive entity (existed before 2020, no assets, no activity)</li>';
    d += '</ul></div></div>';

    d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.85rem">';
    d += '<strong>Important:</strong> The CTA has faced legal challenges. Check FinCEN.gov for the most current enforcement status and deadlines before filing. When in doubt, file \u2014 there is no penalty for filing even if you later determine you were exempt.';
    d += '</div>';

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
