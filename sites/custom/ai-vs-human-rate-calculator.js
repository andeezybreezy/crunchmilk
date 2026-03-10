(function() {
  'use strict';

  var taskData = {
    blog_post:      { human: [80, 150, 250],  ai: [1, 3, 8],     editMin: 15, label: 'Blog Post (1,000 words)' },
    social_media:   { human: [100, 250, 500],  ai: [2, 5, 12],    editMin: 10, label: 'Social Media (10 posts)' },
    logo_design:    { human: [200, 500, 1500], ai: [5, 15, 40],   editMin: 30, label: 'Logo Design' },
    web_page:       { human: [500, 1200, 3000],ai: [10, 30, 80],  editMin: 45, label: 'Web Page Development' },
    data_analysis:  { human: [150, 300, 800],  ai: [5, 12, 30],   editMin: 20, label: 'Data Analysis Report' },
    translation:    { human: [80, 150, 350],   ai: [1, 2, 6],     editMin: 20, label: 'Translation (1,000 words)' },
    customer_email: { human: [200, 350, 600],  ai: [3, 8, 18],    editMin: 10, label: 'Customer Support Emails (50)' },
    code_feature:   { human: [300, 800, 2500], ai: [8, 20, 60],   editMin: 30, label: 'Software Feature (small)' }
  };

  var qualityIndex = { basic: 0, standard: 1, premium: 2 };
  var qualityTradeoffs = {
    basic:    { blog_post: 'Adequate', social_media: 'Good', logo_design: 'Poor', web_page: 'Adequate', data_analysis: 'Good', translation: 'Good', customer_email: 'Good', code_feature: 'Adequate' },
    standard: { blog_post: 'Good', social_media: 'Good', logo_design: 'Fair', web_page: 'Good', data_analysis: 'Good', translation: 'Fair', customer_email: 'Good', code_feature: 'Good' },
    premium:  { blog_post: 'Fair', social_media: 'Fair', logo_design: 'Poor', web_page: 'Fair', data_analysis: 'Fair', translation: 'Poor', customer_email: 'Good', code_feature: 'Fair' }
  };

  var editorRate = 40; // $/hr

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var chartData = [
    ['Blog Post (1,000 words)', '$80\u2013150', '$1\u20135', '95%', 'AI + light edit'],
    ['Social Media (10 posts)', '$100\u2013250', '$2\u20138', '95%', 'AI + brand review'],
    ['Logo Design', '$200\u2013800', '$5\u201320', '96%', 'Human for premium'],
    ['Web Page Dev', '$500\u20132,000', '$10\u201350', '95%', 'AI + human review'],
    ['Data Analysis Report', '$150\u2013400', '$5\u201315', '95%', 'AI + human insight'],
    ['Translation (1,000 words)', '$80\u2013200', '$1\u20133', '97%', 'AI + native review'],
    ['Customer Emails (50)', '$200\u2013400', '$3\u201310', '97%', 'AI for templates']
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
    var taskType = $('taskType').value;
    var quality = $('qualityLevel').value;
    var perMonth = parseFloat($('tasksPerMonth').value) || 0;
    var editing = $('humanEditing').value;
    var task = taskData[taskType];
    var qi = qualityIndex[quality];

    if (!task || perMonth <= 0) return;

    var humanCost = task.human[qi];
    var aiCost = task.ai[qi];

    // Add human editing cost for AI output
    var editCost = 0;
    if (editing === 'light') {
      editCost = (15 / 60) * editorRate;
    } else if (editing === 'heavy') {
      editCost = (45 / 60) * editorRate;
    }
    var totalAiCost = aiCost + editCost;

    var monthlySave = (humanCost - totalAiCost) * perMonth;
    var annualSave = monthlySave * 12;
    var pctSave = ((humanCost - totalAiCost) / humanCost) * 100;

    $('rHumanTask').textContent = fmt(humanCost);
    $('rAiTask').textContent = fmt(totalAiCost);
    $('rMonthlySave').textContent = fmt(monthlySave);
    $('rMonthlySave').style.color = monthlySave >= 0 ? '#059669' : '#dc2626';
    $('rAnnualSave').textContent = fmt(annualSave);
    $('rAnnualSave').style.color = annualSave >= 0 ? '#059669' : '#dc2626';
    $('rPctSave').textContent = pctSave.toFixed(1) + '%';
    $('rQuality').textContent = qualityTradeoffs[quality][taskType];

    var d = '';
    d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Cost Breakdown per Task</strong><br>';
    d += '<span style="font-size:0.9rem">Human freelancer: ' + fmt(humanCost) + '<br>';
    d += 'AI tool cost: ' + fmt(aiCost) + '<br>';
    if (editCost > 0) {
      d += 'Human editing: ' + fmt(editCost) + '<br>';
    }
    d += 'Total AI approach: ' + fmt(totalAiCost) + '</span></div>';

    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Annual Projection</strong><br>';
    d += '<span style="font-size:0.9rem">' + (perMonth * 12) + ' tasks/year<br>';
    d += 'Human total: ' + fmt(humanCost * perMonth * 12) + '/year<br>';
    d += 'AI total: ' + fmt(totalAiCost * perMonth * 12) + '/year</span></div>';

    if (quality === 'premium') {
      d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.85rem">';
      d += '<strong>Note:</strong> For premium quality work, AI output typically requires significant human review and refinement. Consider using AI for initial drafts and a human expert for final polish to get the best of both approaches.';
      d += '</div>';
    }

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
