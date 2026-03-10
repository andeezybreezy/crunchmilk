(function() {
  'use strict';

  var stateRules = {
    'AL': { name: 'Alabama', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable in scope, duration, and geography.' },
    'AK': { name: 'Alaska', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; limited case law.' },
    'AZ': { name: 'Arizona', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; courts may blue-pencil overly broad terms.' },
    'AR': { name: 'Arkansas', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable with reasonable time and geographic limits.' },
    'CA': { name: 'California', status: 'banned', threshold: 0, maxMonths: 0, notes: 'Non-competes are void and unenforceable. Employers cannot even require employees to sign them (AB 1076).' },
    'CO': { name: 'Colorado', status: 'limited', threshold: 120578, maxMonths: 0, notes: 'Banned for workers earning under ~$120K (adjusted annually). Employers face penalties for using void non-competes.' },
    'CT': { name: 'Connecticut', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; courts apply strict scrutiny.' },
    'DE': { name: 'Delaware', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Generally enforceable; courts use reasonableness test.' },
    'FL': { name: 'Florida', status: 'enforceable', threshold: 0, maxMonths: 24, notes: 'One of the most employer-friendly states. Presumption of enforceability for agreements under 2 years.' },
    'GA': { name: 'Georgia', status: 'enforceable', threshold: 0, maxMonths: 24, notes: 'Enforceable with 2015 reform allowing blue-penciling of overbroad terms.' },
    'HI': { name: 'Hawaii', status: 'limited', threshold: 0, maxMonths: 0, notes: 'Banned for tech workers. Other industries: enforceable if reasonable.' },
    'ID': { name: 'Idaho', status: 'enforceable', threshold: 0, maxMonths: 18, notes: 'Enforceable up to 18 months with proper consideration.' },
    'IL': { name: 'Illinois', status: 'limited', threshold: 75000, maxMonths: 0, notes: 'Banned for workers earning under $75K. Requires adequate consideration (2 years employment or additional consideration).' },
    'IN': { name: 'Indiana', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable in time, geography, and scope.' },
    'IA': { name: 'Iowa', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if supported by consideration and reasonable.' },
    'KS': { name: 'Kansas', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; courts may modify overbroad terms.' },
    'KY': { name: 'Kentucky', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable with continued employment as consideration.' },
    'LA': { name: 'Louisiana', status: 'enforceable', threshold: 0, maxMonths: 24, notes: 'Must specify parish/municipality. Max 2 years. Strictly construed.' },
    'ME': { name: 'Maine', status: 'limited', threshold: 0, maxMonths: 12, notes: 'Banned for hourly workers. Must give notice before hire date. 12-month practical limit.' },
    'MD': { name: 'Maryland', status: 'limited', threshold: 0, maxMonths: 0, notes: 'Banned for workers earning $15/hour or less. Otherwise enforceable if reasonable.' },
    'MA': { name: 'Massachusetts', status: 'limited', threshold: 0, maxMonths: 12, notes: 'Max 12 months. Requires garden leave pay or other consideration. Banned for nonexempt workers.' },
    'MI': { name: 'Michigan', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable. Courts may reform overly broad agreements.' },
    'MN': { name: 'Minnesota', status: 'banned', threshold: 0, maxMonths: 0, notes: 'Banned for all workers effective July 1, 2023. Existing agreements unenforceable.' },
    'MS': { name: 'Mississippi', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable in scope and duration.' },
    'MO': { name: 'Missouri', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; requires valid consideration.' },
    'MT': { name: 'Montana', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable but disfavored. Courts strictly construe in favor of employee.' },
    'NE': { name: 'Nebraska', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; will not blue-pencil — entire agreement void if overbroad.' },
    'NV': { name: 'Nevada', status: 'limited', threshold: 0, maxMonths: 0, notes: 'Cannot restrict former employees paid solely hourly. Must be reasonable in scope.' },
    'NH': { name: 'New Hampshire', status: 'limited', threshold: 0, maxMonths: 0, notes: 'Banned for low-wage workers. Others: enforceable if reasonable.' },
    'NJ': { name: 'New Jersey', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; courts apply three-prong test.' },
    'NM': { name: 'New Mexico', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; limited statutory guidance.' },
    'NY': { name: 'New York', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable. Ban bill vetoed by governor in 2023; reform legislation expected.' },
    'NC': { name: 'North Carolina', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable. Strict requirements on geographic scope.' },
    'ND': { name: 'North Dakota', status: 'banned', threshold: 0, maxMonths: 0, notes: 'Non-competes are void by statute. One of the original ban states.' },
    'OH': { name: 'Ohio', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable in time, geography, and scope.' },
    'OK': { name: 'Oklahoma', status: 'banned', threshold: 0, maxMonths: 0, notes: 'Non-competes are void. Only non-solicitation of established customers is permitted.' },
    'OR': { name: 'Oregon', status: 'limited', threshold: 113241, maxMonths: 12, notes: 'Max 12 months. Banned under ~$113K. Employer must give 2-week notice + signed copy.' },
    'PA': { name: 'Pennsylvania', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; new employment = sufficient consideration.' },
    'RI': { name: 'Rhode Island', status: 'limited', threshold: 0, maxMonths: 12, notes: 'Banned for low-wage, nonexempt, student, under-18 workers. Max 12 months for others.' },
    'SC': { name: 'South Carolina', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable with blue-pencil doctrine; courts modify rather than void.' },
    'SD': { name: 'South Dakota', status: 'enforceable', threshold: 0, maxMonths: 24, notes: 'Enforceable if reasonable; max 2 years generally accepted.' },
    'TN': { name: 'Tennessee', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; continued employment is sufficient consideration.' },
    'TX': { name: 'Texas', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Must be ancillary to an otherwise enforceable agreement with consideration.' },
    'UT': { name: 'Utah', status: 'limited', threshold: 0, maxMonths: 12, notes: 'Post-employment non-competes limited to 1 year maximum by statute.' },
    'VT': { name: 'Vermont', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; limited case law.' },
    'VA': { name: 'Virginia', status: 'limited', threshold: 0, maxMonths: 0, notes: 'Banned for low-wage workers (below average weekly wage ~$1,343/week). Others: enforceable if reasonable.' },
    'WA': { name: 'Washington', status: 'limited', threshold: 116593, maxMonths: 18, notes: 'Banned under ~$117K for employees. Max 18 months. Employer must pay during restriction period.' },
    'WV': { name: 'West Virginia', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable in scope, geography, and duration.' },
    'WI': { name: 'Wisconsin', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; will not blue-pencil — void entirely if overbroad.' },
    'WY': { name: 'Wyoming', status: 'enforceable', threshold: 0, maxMonths: 0, notes: 'Enforceable if reasonable; minimal statutory guidance.' },
    'DC': { name: 'District of Columbia', status: 'limited', threshold: 0, maxMonths: 0, notes: 'Broad ban for non-highly-compensated employees. Medical specialists partially exempt.' }
  };

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 0;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var stateEl = document.getElementById('ncState');
  stateEl.innerHTML = '<option value="">— Select State —</option>';
  var codes = Object.keys(stateRules).sort(function(a, b) {
    return stateRules[a].name.localeCompare(stateRules[b].name);
  });
  codes.forEach(function(code) {
    var opt = document.createElement('option');
    opt.value = code;
    opt.textContent = stateRules[code].name;
    stateEl.appendChild(opt);
  });

  var chartData = [
    ['California', 'Banned', 'N/A', 'N/A', 'Void and unenforceable for all workers'],
    ['Minnesota', 'Banned', 'N/A', 'N/A', 'Banned effective July 2023'],
    ['Colorado', 'Limited', '$120,578+', 'No cap', 'Banned below threshold; penalties for violations'],
    ['Illinois', 'Limited', '$75,000+', 'No cap', 'Banned for low-wage; requires consideration'],
    ['Washington', 'Limited', '$116,593+', '18 months', 'Employer must pay during restriction'],
    ['Texas', 'Enforceable', 'None', 'No cap', 'Must be reasonable; tied to consideration'],
    ['New York', 'Enforceable', 'None', 'No cap', 'Ban bill vetoed 2023; reform expected']
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
    var stateCode = stateEl.value;
    var industry = document.getElementById('ncIndustry').value;
    var level = document.getElementById('ncLevel').value;
    var income = parseFloat(document.getElementById('ncIncome').value) || 0;
    var duration = parseFloat(document.getElementById('ncDuration').value) || 0;
    var scope = document.getElementById('ncScope').value;

    if (!stateCode) return;

    var rule = stateRules[stateCode];
    var score = 50; // 0 = definitely unenforceable, 100 = definitely enforceable
    var factors = [];
    var verdict = '';
    var color = '';

    // State status
    if (rule.status === 'banned') {
      score = 0;
      factors.push({ text: rule.name + ' bans non-compete agreements entirely.', impact: 'positive' });
    } else if (rule.status === 'limited') {
      if (rule.threshold > 0 && income > 0 && income < rule.threshold) {
        score = 5;
        factors.push({ text: 'Your income ($' + fmt(income) + ') is below ' + rule.name + '\'s threshold of $' + fmt(rule.threshold) + '. Non-compete is likely unenforceable.', impact: 'positive' });
      } else if (rule.threshold > 0 && income >= rule.threshold) {
        score = 55;
        factors.push({ text: 'Your income exceeds ' + rule.name + '\'s threshold of $' + fmt(rule.threshold) + '. Non-compete may be enforceable.', impact: 'negative' });
      } else {
        score = 35;
        factors.push({ text: rule.name + ' has significant restrictions on non-competes.', impact: 'positive' });
      }
    } else {
      score = 60;
      factors.push({ text: rule.name + ' generally enforces reasonable non-competes.', impact: 'negative' });
    }

    // Duration factor
    if (duration > 0 && rule.status !== 'banned') {
      if (rule.maxMonths > 0 && duration > rule.maxMonths) {
        score -= 20;
        factors.push({ text: 'Duration (' + duration + ' months) exceeds ' + rule.name + '\'s statutory cap of ' + rule.maxMonths + ' months.', impact: 'positive' });
      } else if (duration > 24) {
        score -= 15;
        factors.push({ text: 'Duration of ' + duration + ' months is generally considered excessive. Courts rarely enforce non-competes over 2 years.', impact: 'positive' });
      } else if (duration > 12) {
        score += 5;
        factors.push({ text: 'Duration of ' + duration + ' months is on the longer side but within range courts sometimes accept.', impact: 'neutral' });
      } else {
        score += 10;
        factors.push({ text: 'Duration of ' + duration + ' months is within the range courts typically find reasonable.', impact: 'negative' });
      }
    }

    // Position level
    if (rule.status !== 'banned') {
      if (level === 'hourly' || level === 'intern') {
        score -= 20;
        factors.push({ text: 'Non-competes for hourly/non-exempt/intern workers are disfavored and banned in many states.', impact: 'positive' });
      } else if (level === 'executive') {
        score += 15;
        factors.push({ text: 'Executives with access to trade secrets and strategic information are most likely to face enforceable non-competes.', impact: 'negative' });
      } else if (level === 'professional') {
        score += 5;
        factors.push({ text: 'Professional/manager-level non-competes are commonly enforced if terms are reasonable.', impact: 'negative' });
      }
    }

    // Geographic scope
    if (rule.status !== 'banned') {
      if (scope === 'global' || scope === 'national') {
        score -= 15;
        factors.push({ text: 'Nationwide/worldwide geographic scope is often deemed unreasonable unless the role truly involves national/global competition.', impact: 'positive' });
      } else if (scope === 'local') {
        score += 10;
        factors.push({ text: 'Local geographic scope is typically considered reasonable.', impact: 'negative' });
      }
    }

    // Industry-specific
    if (rule.status !== 'banned') {
      if (industry === 'healthcare' && (stateCode === 'CO' || stateCode === 'MA' || stateCode === 'CT' || stateCode === 'DE' || stateCode === 'NM' || stateCode === 'RI' || stateCode === 'NH')) {
        score -= 15;
        factors.push({ text: 'Some states restrict or ban non-competes for healthcare workers (physicians, nurses) to protect patient access.', impact: 'positive' });
      }
      if (industry === 'media' && (stateCode === 'NY' || stateCode === 'IL' || stateCode === 'OR')) {
        score -= 10;
        factors.push({ text: 'Several states have banned or limited non-competes for broadcast employees and media workers.', impact: 'positive' });
      }
      if (industry === 'tech' && stateCode === 'HI') {
        score -= 25;
        factors.push({ text: 'Hawaii bans non-competes for technology workers specifically.', impact: 'positive' });
      }
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    if (score <= 10) {
      verdict = 'Banned / Unenforceable';
      color = '#059669';
    } else if (score <= 30) {
      verdict = 'Unlikely Enforceable';
      color = '#059669';
    } else if (score <= 55) {
      verdict = 'Possibly Enforceable';
      color = '#f59e0b';
    } else {
      verdict = 'Likely Enforceable';
      color = '#dc2626';
    }

    var riskLabel = score <= 20 ? 'Low Risk' : score <= 45 ? 'Moderate Risk' : score <= 65 ? 'High Risk' : 'Very High Risk';

    document.getElementById('rEnforce').textContent = verdict;
    document.getElementById('rEnforce').style.color = color;
    document.getElementById('rRisk').textContent = riskLabel;
    document.getElementById('rRisk').style.color = color;

    var d = '';
    d += '<div style="padding:14px;background:#eff6ff;border-radius:8px;border-left:4px solid #1e40af;margin-bottom:16px">';
    d += '<strong>State Law: ' + rule.name + '</strong><br>';
    d += '<span style="font-size:0.9rem">' + rule.notes + '</span>';
    d += '</div>';

    d += '<div style="margin-bottom:16px"><strong>Key Factors</strong></div>';
    factors.forEach(function(f) {
      var bg = f.impact === 'positive' ? '#f0fdf4' : f.impact === 'negative' ? '#fef2f2' : '#f9fafb';
      var icon = f.impact === 'positive' ? '&#10003;' : f.impact === 'negative' ? '&#10007;' : '&#8226;';
      var iconColor = f.impact === 'positive' ? '#059669' : f.impact === 'negative' ? '#dc2626' : '#6b7280';
      d += '<div style="padding:10px 14px;background:' + bg + ';border-radius:6px;margin-bottom:6px;font-size:0.9rem">';
      d += '<span style="color:' + iconColor + ';font-weight:bold;margin-right:8px">' + icon + '</span>';
      d += f.text;
      d += '</div>';
    });

    d += '<div style="padding:14px;background:#fef3c7;border-radius:8px;margin-top:16px;font-size:0.8rem">';
    d += '<strong>Important:</strong> This is a general assessment based on state-level rules. Enforceability depends on the specific language of your agreement, whether adequate consideration was provided, your access to trade secrets, and the reasonableness of restrictions. Courts in the same state can reach different conclusions on similar facts. <strong>Consult an employment attorney</strong> for advice specific to your situation.';
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
