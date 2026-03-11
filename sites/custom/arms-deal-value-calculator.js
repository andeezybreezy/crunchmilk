(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var buyer = document.getElementById('buyer').value;

    // Calculation logic
    var data = {saudi: {imports: 8.5, supplier: 'USA (73%)', budget: 75, deals: 'F-15 fleet, THAAD missiles, naval vessels'}, india: {imports: 7.2, supplier: 'Russia (45%), France (29%)', budget: 74, deals: 'Rafale jets, S-400 systems, submarines'}, egypt: {imports: 3.1, supplier: 'USA (43%), France (28%)', budget: 4.6, deals: 'F-16s, Rafale jets, Mistral ships'}, qatar: {imports: 3.8, supplier: 'USA (50%), France (25%)', budget: 15, deals: 'F-15QA, Rafale, NH90 helicopters'}, uae: {imports: 4.5, supplier: 'USA (60%), France (20%)', budget: 23, deals: 'F-35 (negotiating), Patriot, drones'}, australia: {imports: 3.2, supplier: 'USA (70%), UK (15%)', budget: 32, deals: 'AUKUS submarines, F-35, Abrams tanks'}, japan: {imports: 2.8, supplier: 'USA (95%)', budget: 50, deals: 'F-35, Aegis systems, Osprey'}, taiwan: {imports: 2.5, supplier: 'USA (100%)', budget: 19, deals: 'F-16V, M1 Abrams, Harpoon missiles'}, poland: {imports: 3.5, supplier: 'South Korea (40%), USA (40%)', budget: 30, deals: 'K2 tanks, FA-50 jets, HIMARS'}, israel: {imports: 2.4, supplier: 'USA (90%)', budget: 24, deals: 'F-35, Iron Dome, KC-46 tankers'}}; var d = data[v.buyer]; var pct = (d.imports / d.budget * 100).toFixed(0); return {annualImports: '$' + d.imports + ' billion/year', topSupplier: d.supplier, defBudget: '$' + d.budget + ' billion', importPct: pct + '% spent on imports', keyDeals: d.deals};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['buyer'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
