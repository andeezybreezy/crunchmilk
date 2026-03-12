(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var ukraine = parseFloat(document.getElementById('ukraine').value) || 0;
    var mideast = parseFloat(document.getElementById('mideast').value) || 0;
    var taiwan = parseFloat(document.getElementById('taiwan').value) || 0;
    var tradeWar = parseFloat(document.getElementById('tradeWar').value) || 0;
    var nuclear = parseFloat(document.getElementById('nuclear').value) || 0;

    // Calculation logic
    var score = ukraine * 0.2 + mideast * 0.25 + taiwan * 0.2 + tradeWar * 0.15 + nuclear * 0.2; var normalized = (score * 10).toFixed(0); var level = score > 7.5 ? 'Critical — multiple simultaneous crises' : score > 6 ? 'High — elevated risk across multiple theaters' : score > 4 ? 'Elevated — significant tensions' : 'Moderate — baseline tensions'; var market = score > 7 ? 'S&P 500 at -10 to -20% risk, VIX likely 30+' : score > 5 ? 'Market volatility elevated, defense stocks outperform' : 'Markets pricing in moderate risk premium'; var oilPremium = '$' + Math.round(score * 4) + '-' + Math.round(score * 6) + '/barrel'; var comp = score > 7 ? 'Similar to 1962 Cuban Missile Crisis + 1973 Oil Embargo combined risk' : score > 5 ? 'Similar to 2003 Iraq invasion era or 2014 Crimea annexation' : 'Within post-Cold War baseline'; var threats = []; if (mideast >= ukraine && mideast >= taiwan) threats.push('Middle East'); if (ukraine >= mideast && ukraine >= taiwan) threats.push('Ukraine-Russia'); if (taiwan >= 7) threats.push('Taiwan Strait');     document.getElementById('globalRisk').textContent = normalized + '/100';
    document.getElementById('riskLevel').textContent = level;
    document.getElementById('marketImpact').textContent = market;
    document.getElementById('oilRiskPremium').textContent = oilPremium;
    document.getElementById('historicalComp').textContent = comp;
    document.getElementById('primaryThreat').textContent = threats.join(', ') || 'Distributed risk';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['ukraine', 'mideast', 'taiwan', 'tradeWar', 'nuclear'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
  document.getElementById('ukraine').addEventListener('input', function() { document.getElementById('ukraineVal').textContent = this.value + '/10'; });
  document.getElementById('mideast').addEventListener('input', function() { document.getElementById('mideastVal').textContent = this.value + '/10'; });
  document.getElementById('taiwan').addEventListener('input', function() { document.getElementById('taiwanVal').textContent = this.value + '/10'; });
  document.getElementById('tradeWar').addEventListener('input', function() { document.getElementById('tradeWarVal').textContent = this.value + '/10'; });
  document.getElementById('nuclear').addEventListener('input', function() { document.getElementById('nuclearVal').textContent = this.value + '/10'; });
})();
