(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function fmtDollars(n) {
    if (n < 0.01 && n > 0) return '$' + n.toFixed(4);
    if (n < 1) return '$' + n.toFixed(3);
    return '$' + fmt(n, 2);
  }

  // Pricing per 1M tokens: [input, output]
  var pricing = {
    gpt4o:         [2.50, 10.00],
    gpt4o_mini:    [0.15, 0.60],
    claude_opus:   [15.00, 75.00],
    claude_sonnet: [3.00, 15.00],
    claude_haiku:  [0.80, 4.00],
    gemini_pro:    [1.25, 10.00],
    gemini_flash:  [0.15, 0.60],
    llama:         [0.20, 0.80]
  };

  var modelNames = {
    gpt4o: 'GPT-4o',
    gpt4o_mini: 'GPT-4o Mini',
    claude_opus: 'Claude Opus 4',
    claude_sonnet: 'Claude Sonnet 4',
    claude_haiku: 'Claude Haiku 3.5',
    gemini_pro: 'Gemini 2.5 Pro',
    gemini_flash: 'Gemini 2.5 Flash',
    llama: 'Llama 4 (hosted)'
  };

  var inputMethodEl = document.getElementById('inputMethod');
  var textInputDiv = document.getElementById('textInput');
  var tokenInputDiv = document.getElementById('tokenInput');
  var promptTextEl = document.getElementById('promptText');
  var inputTokensEl = document.getElementById('inputTokens');
  var outputTokensEl = document.getElementById('outputTokens');
  var requestsPerDayEl = document.getElementById('requestsPerDay');
  var modelEl = document.getElementById('model');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var charCountEl = document.getElementById('charCount');
  var wordCountEl = document.getElementById('wordCount');
  var tokenEstEl = document.getElementById('tokenEst');

  var chartData = [
    ['GPT-4o', '$2.50', '$10.00', '128K', 'General purpose'],
    ['GPT-4o Mini', '$0.15', '$0.60', '128K', 'Simple tasks'],
    ['Claude Opus 4', '$15.00', '$75.00', '200K', 'Complex reasoning'],
    ['Claude Sonnet 4', '$3.00', '$15.00', '200K', 'Best value'],
    ['Claude Haiku 3.5', '$0.80', '$4.00', '200K', 'Fast & cheap'],
    ['Gemini 2.5 Pro', '$1.25', '$10.00', '1M', 'Long context'],
    ['Gemini 2.5 Flash', '$0.15', '$0.60', '1M', 'Budget option'],
    ['Llama 4 (hosted)', '$0.20', '$0.80', '128K', 'Open source']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      var cells = '';
      for (var i = 0; i < row.length; i++) cells += '<td>' + row[i] + '</td>';
      tr.innerHTML = cells;
      chartBody.appendChild(tr);
    });
  }

  inputMethodEl.addEventListener('change', function() {
    if (inputMethodEl.value === 'text') {
      textInputDiv.style.display = '';
      tokenInputDiv.style.display = 'none';
    } else {
      textInputDiv.style.display = 'none';
      tokenInputDiv.style.display = '';
    }
  });

  promptTextEl.addEventListener('input', function() {
    var text = promptTextEl.value;
    var chars = text.length;
    var words = text.trim() ? text.trim().split(/\s+/).length : 0;
    var tokens = Math.ceil(chars / 4);
    charCountEl.textContent = chars;
    wordCountEl.textContent = words;
    tokenEstEl.textContent = tokens;
  });

  function getVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function calculate() {
    var inTokens;
    if (inputMethodEl.value === 'text') {
      var text = promptTextEl.value;
      inTokens = Math.ceil(text.length / 4);
    } else {
      inTokens = getVal(inputTokensEl);
    }

    var outTokens = getVal(outputTokensEl);
    var reqPerDay = getVal(requestsPerDayEl);
    var model = modelEl.value;

    if (inTokens <= 0 && outTokens <= 0) return;

    var prices = pricing[model];
    var inputCost = (inTokens / 1000000) * prices[0];
    var outputCost = (outTokens / 1000000) * prices[1];
    var costPerRequest = inputCost + outputCost;
    var dailyCost = costPerRequest * reqPerDay;
    var monthlyCost = dailyCost * 30;
    var totalTokens = inTokens + outTokens;

    document.getElementById('rPerRequest').textContent = fmtDollars(costPerRequest);
    document.getElementById('rDaily').textContent = fmtDollars(dailyCost);
    document.getElementById('rMonthly').textContent = fmtDollars(monthlyCost);
    document.getElementById('rMonthly').style.color = monthlyCost > 100 ? '#dc2626' : monthlyCost > 10 ? '#d97706' : '#059669';
    document.getElementById('rTokens').textContent = fmt(totalTokens, 0);

    var d = '';

    d += '<div style="padding:12px;background:#eef2ff;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>' + modelNames[model] + ' Cost Breakdown</strong><br>';
    d += 'Input: ' + fmt(inTokens, 0) + ' tokens × $' + prices[0] + '/1M = ' + fmtDollars(inputCost) + '<br>';
    d += 'Output: ' + fmt(outTokens, 0) + ' tokens × $' + prices[1] + '/1M = ' + fmtDollars(outputCost) + '<br>';
    d += '<strong>Per request: ' + fmtDollars(costPerRequest) + '</strong>';
    d += '</div>';

    // Scale comparison
    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Cost at Scale</strong><br>';
    var scales = [100, 1000, 10000, 100000];
    scales.forEach(function(s) {
      d += fmt(s, 0) + ' requests: <strong>' + fmtDollars(costPerRequest * s) + '</strong><br>';
    });
    d += '</div>';

    // Cross-model comparison
    d += '<div style="padding:12px;background:#f5f3ff;border-radius:8px;font-size:0.9rem">';
    d += '<strong>Same Task, Different Models</strong><br>';
    var keys = Object.keys(pricing);
    keys.forEach(function(k) {
      var p = pricing[k];
      var c = (inTokens / 1000000) * p[0] + (outTokens / 1000000) * p[1];
      var monthly = c * reqPerDay * 30;
      var isSelected = k === model;
      d += '<div style="display:flex;justify-content:space-between;padding:4px 0;' + (isSelected ? 'font-weight:700;color:#6366f1' : '') + '">';
      d += '<span>' + modelNames[k] + (isSelected ? ' (selected)' : '') + '</span>';
      d += '<span>' + fmtDollars(c) + '/req → ' + fmtDollars(monthly) + '/mo</span>';
      d += '</div>';
    });
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

  [inputMethodEl, inputTokensEl, outputTokensEl, requestsPerDayEl, modelEl, promptTextEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
