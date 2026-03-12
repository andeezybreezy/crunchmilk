(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var state = document.getElementById('state').value;
    var cutPct = parseFloat(document.getElementById('cutPct').value) || 0;

    // Calculation logic
    var states = {ca: {fed: 436, pop: 39.5, jobs: 380000, programs: 'Medi-Cal, defense contracts, UC research', dep: 0.85}, tx: {fed: 304, pop: 30.5, jobs: 290000, programs: 'Military bases, Medicaid, NASA, border security', dep: 0.92}, fl: {fed: 268, pop: 22.6, jobs: 195000, programs: 'Medicare, VA hospitals, military bases', dep: 1.15}, ny: {fed: 280, pop: 19.7, jobs: 210000, programs: 'Medicaid, federal courts, transit, housing', dep: 0.78}, pa: {fed: 175, pop: 13.0, jobs: 155000, programs: 'Medicare, VA, defense contractors', dep: 1.05}, il: {fed: 152, pop: 12.5, jobs: 130000, programs: 'Medicaid, SNAP, federal agencies', dep: 0.82}, oh: {fed: 155, pop: 11.8, jobs: 145000, programs: 'Medicare, Wright-Patterson AFB, VA', dep: 1.10}, va: {fed: 195, pop: 8.6, jobs: 350000, programs: 'Pentagon, military bases, federal HQ, contractors', dep: 1.85}, az: {fed: 95, pop: 7.4, jobs: 85000, programs: 'Military bases, border patrol, tribal programs', dep: 1.20}, nm: {fed: 45, pop: 2.1, jobs: 60000, programs: 'Los Alamos, Sandia Labs, Kirtland AFB, tribal', dep: 2.10}, ak: {fed: 18, pop: 0.73, jobs: 35000, programs: 'Military bases, native programs, Coast Guard', dep: 2.30}, ms: {fed: 48, pop: 2.9, jobs: 55000, programs: 'Medicaid, military bases, SNAP, rural programs', dep: 2.15}, wv: {fed: 28, pop: 1.8, jobs: 32000, programs: 'Medicare, Medicaid, VA, coal transition', dep: 2.40}, ky: {fed: 65, pop: 4.5, jobs: 65000, programs: 'Fort Knox, VA, Medicaid, rural programs', dep: 1.95}}; var s = states[state]; var cut = s.fed * (cutPct / 100); var perRes = Math.round(cut * 1e9 / (s.pop * 1e6)); var jobsLost = Math.round(s.jobs * (cutPct / 100));     document.getElementById('federalToState').textContent = '$' + s.fed + ' billion/year';
    document.getElementById('cutAmount').textContent = '-$' + cut.toFixed(1) + ' billion';
    document.getElementById('perResident').textContent = '-$' + perRes.toLocaleString() + '/resident';
    document.getElementById('jobsAtRisk').textContent = jobsLost.toLocaleString() + ' jobs';
    document.getElementById('topPrograms').textContent = s.programs;
    document.getElementById('dependency').textContent = s.dep.toFixed(2) + ':1 (receives $' + s.dep.toFixed(2) + ' per $1 in federal taxes)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['state', 'cutPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
