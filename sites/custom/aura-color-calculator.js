(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dominant = document.getElementById('dominant').value;
    var stress = document.getElementById('stress').value;
    var social = document.getElementById('social').value;
    var birthMonth = parseFloat(document.getElementById('birthMonth').value) || 0;

    // Calculation logic
    var colors = {
      leader: {primary:'Red',secondary:'Orange',chakra:'Root (Muladhara)',hex:'#FF0000'},
      creative: {primary:'Orange',secondary:'Yellow',chakra:'Sacral (Svadhisthana)',hex:'#FF8C00'},
      healer: {primary:'Green',secondary:'Pink',chakra:'Heart (Anahata)',hex:'#00CC66'},
      thinker: {primary:'Blue',secondary:'Indigo',chakra:'Throat (Vishuddha)',hex:'#0066CC'},
      spiritual: {primary:'Violet',secondary:'White',chakra:'Crown (Sahasrara)',hex:'#8B00FF'},
      energetic: {primary:'Yellow',secondary:'Gold',chakra:'Solar Plexus (Manipura)',hex:'#FFD700'},
      peaceful: {primary:'Indigo',secondary:'Turquoise',chakra:'Third Eye (Ajna)',hex:'#4B0082'}
    };
    var c = colors[dominant];
    var stressLevel = parseInt(stress);
    var advice;
    if (stressLevel <= 2) advice = 'Your aura is vibrant and clear. Continue your current self-care practices.';
    else if (stressLevel <= 4) advice = 'Some cloudiness detected. Meditation and time in nature can brighten your aura.';
    else advice = 'Your aura may be dim or muddy. Prioritize rest, grounding exercises, and energy clearing.';
    var socialMod = '';
    if (social === 'introvert') socialMod = ' with a protective, inward-facing quality';
    else if (social === 'extrovert') socialMod = ' with a radiant, expansive quality';
    else socialMod = ' with a balanced, adaptive quality';
    document.getElementById('primaryAura').textContent = c.primary + socialMod;
    document.getElementById('secondaryAura').textContent = c.secondary;
    document.getElementById('chakra').textContent = c.chakra;
    document.getElementById('advice').textContent = advice;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dominant', 'stress', 'social', 'birthMonth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
