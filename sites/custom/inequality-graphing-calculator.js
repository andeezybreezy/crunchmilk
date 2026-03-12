(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;
    var c = parseFloat(document.getElementById('c').value) || 0;
    var type = document.getElementById('type').value;

    // Calculation logic
    var tp=document.getElementById('type').value;document.getElementById('solution').textContent=a+'x + '+b+'y = '+c;var dashed=tp==='lt'||tp==='gt';document.getElementById('boundary').textContent=dashed?'Dashed line (boundary NOT included)':'Solid line (boundary included)';var testVal=a*0+b*0;var satisfies;if(tp==='lt')satisfies=testVal<c;else if(tp==='gt')satisfies=testVal>c;else if(tp==='lte')satisfies=testVal<=c;else satisfies=testVal>=c;document.getElementById('testPoint').textContent='(0,0): '+a+'(0)+'+b+'(0)=0 '+( satisfies?'✓ satisfies — shade toward (0,0)':'✗ does not satisfy — shade away from (0,0)');if(b!==0){var slopeDir=tp==='lt'||tp==='lte'?'below':'above';document.getElementById('shading').textContent='Shade '+slopeDir+' the boundary line';}else{document.getElementById('shading').textContent='Shade '+(tp==='lt'||tp==='lte'?'left':'right')+' of the vertical boundary';}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a', 'b', 'c', 'type'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
