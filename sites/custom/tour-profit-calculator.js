(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var shows = parseFloat(document.getElementById('shows').value) || 0;
    var avgTicketPrice = parseFloat(document.getElementById('avgTicketPrice').value) || 0;
    var avgAttendance = parseFloat(document.getElementById('avgAttendance').value) || 0;
    var venueSplit = parseFloat(document.getElementById('venueSplit').value) || 0;
    var travelPerShow = parseFloat(document.getElementById('travelPerShow').value) || 0;
    var crewCostPerShow = parseFloat(document.getElementById('crewCostPerShow').value) || 0;

    // Calculation logic
    var grossRev = shows * avgTicketPrice * avgAttendance;
    var venueCut = grossRev * (venueSplit / 100);
    var netTicket = grossRev - venueCut;
    var totalExp = shows * (travelPerShow + crewCostPerShow);
    var netProfitVal = netTicket - totalExp;
    var perShow = shows > 0 ? netProfitVal / shows : 0;
    document.getElementById('grossTicketRev').textContent = '$' + grossRev.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('venueDeductions').textContent = '-$' + venueCut.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('netTicketRev').textContent = '$' + netTicket.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalExpenses').textContent = '-$' + totalExp.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('netProfit').textContent = (netProfitVal >= 0 ? '$' : '-$') + Math.abs(netProfitVal).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('profitPerShow').textContent = (perShow >= 0 ? '$' : '-$') + Math.abs(perShow).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['shows', 'avgTicketPrice', 'avgAttendance', 'venueSplit', 'travelPerShow', 'crewCostPerShow'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
