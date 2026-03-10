(function() {
  'use strict';

  var chartData = [
    ['$3,000', '$1,500', '$900', '$600'],
    ['$4,000', '$2,000', '$1,200', '$800'],
    ['$5,000', '$2,500', '$1,500', '$1,000'],
    ['$6,000', '$3,000', '$1,800', '$1,200'],
    ['$7,500', '$3,750', '$2,250', '$1,500'],
    ['$10,000', '$5,000', '$3,000', '$2,000'],
    ['$12,500', '$6,250', '$3,750', '$2,500'],
    ['$15,000', '$7,500', '$4,500', '$3,000']
  ];

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function calculate() {
    var income = parseFloat(document.getElementById('income').value);
    if (isNaN(income) || income <= 0) return;

    var needsPct = parseFloat(document.getElementById('needsPct').value) || 50;
    var wantsPct = parseFloat(document.getElementById('wantsPct').value) || 30;
    var savingsPct = parseFloat(document.getElementById('savingsPct').value) || 20;

    var total = needsPct + wantsPct + savingsPct;
    var warningEl = document.getElementById('pctWarning');
    if (Math.abs(total - 100) > 0.01) {
      warningEl.textContent = 'Note: Your percentages add up to ' + total + '%, not 100%.';
    } else {
      warningEl.textContent = '';
    }

    var needs = income * (needsPct / 100);
    var wants = income * (wantsPct / 100);
    var savings = income * (savingsPct / 100);

    // Update labels with custom percentages
    document.querySelector('#result .result-item:nth-child(1) .result-label').textContent = 'Needs (' + needsPct + '%)';
    document.querySelector('#result .result-item:nth-child(2) .result-label').textContent = 'Wants (' + wantsPct + '%)';
    document.querySelector('#result .result-item:nth-child(3) .result-label').textContent = 'Savings (' + savingsPct + '%)';

    document.getElementById('needsAmt').textContent = fmt(needs) + '/mo';
    document.getElementById('wantsAmt').textContent = fmt(wants) + '/mo';
    document.getElementById('savingsAmt').textContent = fmt(savings) + '/mo';

    document.getElementById('needsYear').textContent = fmt(needs * 12);
    document.getElementById('wantsYear').textContent = fmt(wants * 12);
    document.getElementById('savingsYear').textContent = fmt(savings * 12);

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('income').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

  // Render chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

})();
