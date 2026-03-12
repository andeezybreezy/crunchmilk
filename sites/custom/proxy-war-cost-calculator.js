(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var conflict = document.getElementById('conflict').value;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var data = {yemen: {annual: 5, casualties: '377,000+', direct: '20x cheaper than direct invasion', sponsors: 'Saudi Arabia (~$100B total), Iran (~$1B/yr to Houthis)'}, syria: {annual: 4, casualties: '500,000+', direct: 'Multiple sponsors spent $50B+ combined', sponsors: 'Russia, Iran, USA, Turkey, Gulf states'}, ukraine: {annual: 45, casualties: '200,000+ military', direct: 'Most expensive modern proxy — approaching direct war cost', sponsors: 'USA ($75B+), EU ($50B+), Russia (domestic spending)'}, libya: {annual: 2, casualties: '50,000+', direct: '10x cheaper than direct intervention', sponsors: 'Turkey, UAE, Egypt, Russia (Wagner)'}, lebanon: {annual: 0.7, casualties: 'Varies by period', direct: 'Very cost-effective for Iran\'s influence', sponsors: 'Iran ($700M-1B/yr to Hezbollah)'}}; var d = data[conflict]; var total = d.annual * years;     document.getElementById('sponsorCost').textContent = '$' + d.annual + ' billion/year (primary sponsor)';
    document.getElementById('totalSpent').textContent = '$' + total + ' billion over ' + years + ' years';
    document.getElementById('casualties').textContent = d.casualties;
    document.getElementById('vsDirectWar').textContent = d.direct;
    document.getElementById('mainSponsors').textContent = d.sponsors;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['conflict', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
