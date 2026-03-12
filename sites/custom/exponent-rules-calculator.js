(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var base1 = parseFloat(document.getElementById('base1').value) || 0;
    var exp1 = parseFloat(document.getElementById('exp1').value) || 0;
    var base2 = parseFloat(document.getElementById('base2').value) || 0;
    var exp2 = parseFloat(document.getElementById('exp2').value) || 0;
    var operation = document.getElementById('operation').value;

    // Calculation logic
    var op=document.getElementById('operation').value;if(op==='multiply'){var newExp=exp1+exp2;var val=Math.pow(base1,newExp);document.getElementById('rule').textContent='aᵐ · aⁿ = aᵐ⁺ⁿ';document.getElementById('answer').textContent=base1+'^'+newExp+' = '+fmt(val,4);document.getElementById('explanation').textContent=base1+'^'+exp1+' · '+base2+'^'+exp2+' → '+base1+'^('+exp1+'+'+exp2+') = '+base1+'^'+newExp;}else if(op==='divide'){var newExp=exp1-exp2;var val=Math.pow(base1,newExp);document.getElementById('rule').textContent='aᵐ / aⁿ = aᵐ⁻ⁿ';document.getElementById('answer').textContent=base1+'^'+newExp+' = '+fmt(val,4);document.getElementById('explanation').textContent=base1+'^'+exp1+' / '+base2+'^'+exp2+' → '+base1+'^('+exp1+'-'+exp2+') = '+base1+'^'+newExp;}else{var newExp=exp1*exp2;var val=Math.pow(base1,newExp);document.getElementById('rule').textContent='(aᵐ)ⁿ = aᵐ·ⁿ';document.getElementById('answer').textContent=base1+'^'+newExp+' = '+fmt(val,4);document.getElementById('explanation').textContent='('+base1+'^'+exp1+')^'+exp2+' → '+base1+'^('+exp1+'·'+exp2+') = '+base1+'^'+newExp;}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['base1', 'exp1', 'base2', 'exp2', 'operation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
