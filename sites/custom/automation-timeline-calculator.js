(function() {
  'use strict';

  var roleTasks = {
    admin:          { routine: 0.50, analytical: 0.15, creative: 0.05, physical: 0.05, interpersonal: 0.25, firstTask: 'Scheduling & data entry', label: 'Administrative' },
    analyst:        { routine: 0.20, analytical: 0.50, creative: 0.10, physical: 0.00, interpersonal: 0.20, firstTask: 'Standard report generation', label: 'Analyst' },
    creative:       { routine: 0.10, analytical: 0.10, creative: 0.55, physical: 0.00, interpersonal: 0.25, firstTask: 'First draft content', label: 'Creative' },
    customerService:{ routine: 0.40, analytical: 0.10, creative: 0.05, physical: 0.00, interpersonal: 0.45, firstTask: 'Tier 1 ticket responses', label: 'Customer Service' },
    developer:      { routine: 0.15, analytical: 0.45, creative: 0.20, physical: 0.00, interpersonal: 0.20, firstTask: 'Boilerplate code generation', label: 'Software Development' },
    finance:        { routine: 0.30, analytical: 0.40, creative: 0.05, physical: 0.00, interpersonal: 0.25, firstTask: 'Transaction categorization', label: 'Finance / Accounting' },
    healthcare:     { routine: 0.10, analytical: 0.20, creative: 0.05, physical: 0.40, interpersonal: 0.25, firstTask: 'Medical charting & notes', label: 'Healthcare Clinical' },
    legal:          { routine: 0.25, analytical: 0.35, creative: 0.10, physical: 0.00, interpersonal: 0.30, firstTask: 'Document review & research', label: 'Legal / Compliance' },
    management:     { routine: 0.10, analytical: 0.20, creative: 0.15, physical: 0.00, interpersonal: 0.55, firstTask: 'Status report compilation', label: 'Management' },
    manufacturing:  { routine: 0.15, analytical: 0.05, creative: 0.00, physical: 0.65, interpersonal: 0.15, firstTask: 'Quality inspection sorting', label: 'Manufacturing' },
    marketing:      { routine: 0.15, analytical: 0.25, creative: 0.30, physical: 0.00, interpersonal: 0.30, firstTask: 'Ad copy & social drafts', label: 'Marketing / Sales' },
    trades:         { routine: 0.05, analytical: 0.05, creative: 0.05, physical: 0.70, interpersonal: 0.15, firstTask: 'Diagnostic scanning', label: 'Skilled Trades' }
  };

  // Current AI capability by task type (0-1)
  var aiCapability = { routine: 0.80, analytical: 0.60, creative: 0.55, physical: 0.15, interpersonal: 0.20 };

  // Years until 80% capability by task type
  var yearsTo80 = { routine: 1, analytical: 4, creative: 6, physical: 12, interpersonal: 15 };

  var sizeMultiplier = { small: 1.4, medium: 1.1, large: 0.9, enterprise: 0.75 };
  var adoptionMultiplier = { fast: 0.8, moderate: 1.0, slow: 1.4 };

  function $(id) { return document.getElementById(id); }

  var chartData = [
    ['Routine Data Entry', '85% capable', '2025\u20132026', '2028\u20132030', 'High'],
    ['Basic Analysis/Reports', '70% capable', '2026\u20132028', '2030\u20132033', 'High'],
    ['Creative First Drafts', '65% capable', '2026\u20132028', '2032\u20132035', 'Medium'],
    ['Customer Service (Tier 1)', '75% capable', '2025\u20132027', '2029\u20132031', 'High'],
    ['Complex Strategy', '30% capable', '2030\u20132035', '2038+', 'Low'],
    ['Skilled Physical Work', '15% capable', '2033\u20132040', '2045+', 'Low'],
    ['Interpersonal/Counseling', '20% capable', '2035+', 'Not foreseeable', 'Very Low']
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
    var role = $('role').value;
    var companySize = $('companySize').value;
    var techAdoption = $('techAdoption').value;
    var weeklyHours = parseFloat($('weeklyHours').value) || 40;

    var r = roleTasks[role];
    if (!r) return;

    var sizeMult = sizeMultiplier[companySize];
    var adoptMult = adoptionMultiplier[techAdoption];

    // Calculate automatable hours by 2028 (2 years) and 2032 (6 years)
    var hours2028 = 0;
    var hours2032 = 0;
    var taskTypes = ['routine', 'analytical', 'creative', 'physical', 'interpersonal'];

    taskTypes.forEach(function(t) {
      var taskHours = weeklyHours * r[t];
      var cap2028 = Math.min(1, aiCapability[t] + (2 / yearsTo80[t]) * 0.3);
      var cap2032 = Math.min(1, aiCapability[t] + (6 / yearsTo80[t]) * 0.3);
      // Apply adoption delay
      var adoptionFactor2028 = Math.max(0, 1 - (sizeMult * adoptMult - 0.6) * 0.5);
      var adoptionFactor2032 = Math.max(0.2, 1 - (sizeMult * adoptMult - 0.6) * 0.25);
      hours2028 += taskHours * cap2028 * adoptionFactor2028;
      hours2032 += taskHours * cap2032 * adoptionFactor2032;
    });

    hours2028 = Math.min(hours2028, weeklyHours * 0.85);
    hours2032 = Math.min(hours2032, weeklyHours * 0.90);

    var pct2028 = (hours2028 / weeklyHours) * 100;
    var pct2032 = (hours2032 / weeklyHours) * 100;

    var urgency = '';
    var urgColor = '';
    if (pct2028 > 50) { urgency = 'High \u2014 Act now'; urgColor = '#dc2626'; }
    else if (pct2028 > 30) { urgency = 'Moderate'; urgColor = '#f59e0b'; }
    else if (pct2028 > 15) { urgency = 'Low'; urgColor = '#059669'; }
    else { urgency = 'Minimal'; urgColor = '#059669'; }

    $('rHours2028').textContent = hours2028.toFixed(1) + ' hrs (' + pct2028.toFixed(0) + '%)';
    $('rHours2032').textContent = hours2032.toFixed(1) + ' hrs (' + pct2032.toFixed(0) + '%)';
    $('rFirstTask').textContent = r.firstTask;
    $('rFirstTask').style.fontSize = '0.85rem';
    $('rUrgency').textContent = urgency;
    $('rUrgency').style.color = urgColor;

    var d = '';
    // Timeline visualization
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>' + r.label + ' \u2014 Task Automation Timeline</strong>';
    d += '<div style="margin-top:10px">';
    taskTypes.forEach(function(t) {
      if (r[t] <= 0) return;
      var pct = (aiCapability[t] * 100).toFixed(0);
      var barColor = pct > 60 ? '#dc2626' : pct > 35 ? '#f59e0b' : '#059669';
      d += '<div style="margin-bottom:8px">';
      d += '<div style="display:flex;justify-content:space-between;font-size:0.8rem">';
      d += '<span>' + t.charAt(0).toUpperCase() + t.slice(1) + ' (' + (r[t] * 100).toFixed(0) + '% of role)</span>';
      d += '<span>' + pct + '% AI capable</span></div>';
      d += '<div style="width:100%;height:8px;background:#e5e7eb;border-radius:4px">';
      d += '<div style="width:' + pct + '%;height:100%;background:' + barColor + ';border-radius:4px"></div>';
      d += '</div></div>';
    });
    d += '</div></div>';

    d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-bottom:12px">';
    d += '<strong style="color:#059669">Adaptation Strategy</strong>';
    d += '<ul style="margin:8px 0 0 0;padding-left:20px;font-size:0.9rem;line-height:1.7">';
    if (r.routine > 0.3) d += '<li>Automate routine tasks first \u2014 learn AI workflow tools</li>';
    if (r.analytical > 0.3) d += '<li>Shift from doing analysis to interpreting and directing AI analysis</li>';
    if (r.creative > 0.3) d += '<li>Focus on strategy and judgment \u2014 use AI for execution</li>';
    if (r.interpersonal > 0.3) d += '<li>Double down on relationship skills \u2014 these remain human advantages</li>';
    if (r.physical > 0.3) d += '<li>Your physical skills are well-protected \u2014 add tech literacy</li>';
    d += '<li>Learn prompt engineering and AI tool orchestration</li>';
    d += '</ul></div>';

    d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.85rem">';
    d += '<strong>Context:</strong> These timelines assume continued AI advancement at roughly the current pace. Actual adoption depends on cost, reliability, regulation, and organizational readiness. Most roles will be transformed rather than eliminated.';
    d += '</div>';

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
