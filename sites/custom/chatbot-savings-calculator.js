(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyTickets = parseFloat(document.getElementById('monthlyTickets').value) || 0;
    var avgHandleTime = parseFloat(document.getElementById('avgHandleTime').value) || 0;
    var agentHourlyRate = parseFloat(document.getElementById('agentHourlyRate').value) || 0;
    var deflectionRate = parseFloat(document.getElementById('deflectionRate').value) || 0;
    var chatbotCost = parseFloat(document.getElementById('chatbotCost').value) || 0;

    // Calculation logic
    var totalMinutes = monthlyTickets * avgHandleTime;
    var totalHours = totalMinutes / 60;
    var currentCost = totalHours * agentHourlyRate;
    var deflected = Math.round(monthlyTickets * deflectionRate / 100);
    var remainingTickets = monthlyTickets - deflected;
    var newAgentCost = (remainingTickets * avgHandleTime / 60) * agentHourlyRate;
    var newTotal = newAgentCost + chatbotCost;
    var savings = currentCost - newTotal;
    var yearROI = ((savings * 12) / (chatbotCost * 12)) * 100;
    document.getElementById('currentCost').textContent = dollar(currentCost);
    document.getElementById('ticketsDeflected').textContent = fmt(deflected, 0) + '/month';
    document.getElementById('newCost').textContent = dollar(newTotal);
    document.getElementById('monthlySavings').textContent = dollar(savings);
    document.getElementById('yearlyROI').textContent = fmt(yearROI, 0) + '%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyTickets', 'avgHandleTime', 'agentHourlyRate', 'deflectionRate', 'chatbotCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
