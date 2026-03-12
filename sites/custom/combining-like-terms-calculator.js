(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var term1Coeff = parseFloat(document.getElementById('term1Coeff').value) || 0;
    var term1Var = parseFloat(document.getElementById('term1Var').value) || 0;
    var term2Coeff = parseFloat(document.getElementById('term2Coeff').value) || 0;
    var term2Var = parseFloat(document.getElementById('term2Var').value) || 0;
    var term3Coeff = parseFloat(document.getElementById('term3Coeff').value) || 0;
    var term3Var = parseFloat(document.getElementById('term3Var').value) || 0;

    // Calculation logic
    var c1=parseFloat(term1Coeff),v1=term1Var.trim(),c2=parseFloat(term2Coeff),v2=term2Var.trim(),c3=parseFloat(term3Coeff),v3=term3Var.trim();var terms={};function addTerm(c,v){var key=v||'constant';terms[key]=(terms[key]||0)+c;}addTerm(c1,v1);addTerm(c2,v2);addTerm(c3,v3);var parts=[];var keys=Object.keys(terms).sort();keys.forEach(function(k){var c=terms[k];if(c===0)return;if(k==='constant'){parts.push(c.toString());}else{if(c===1)parts.push(k);else if(c===-1)parts.push('-'+k);else parts.push(c+k);}});document.getElementById('simplified').textContent=parts.length>0?parts.join(' + ').replace(/\+ -/g,'- '):'0';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['term1Coeff', 'term1Var', 'term2Coeff', 'term2Var', 'term3Coeff', 'term3Var'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
