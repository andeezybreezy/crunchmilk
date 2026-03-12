(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var angle1 = parseFloat(document.getElementById('angle1').value) || 0;
    var angle2 = parseFloat(document.getElementById('angle2').value) || 0;

    // Calculation logic
    var a1=parseFloat(document.getElementById('angle1').value); var a2=parseFloat(document.getElementById('angle2').value); if(isNaN(a1)||a1<=0||isNaN(a2)||a2<=0){document.getElementById('angle3').textContent='Enter positive angles';return;} var a3=180-a1-a2; if(a3<=0){document.getElementById('angle3').textContent='Invalid \u2014 angles exceed 180\u00B0'; document.getElementById('triangleType').textContent='N/A'; document.getElementById('isValid').textContent='No \u2014 '+fmt(a1,2)+'\u00B0 + '+fmt(a2,2)+'\u00B0 = '+fmt(a1+a2,2)+'\u00B0 (must be < 180\u00B0)';return;} document.getElementById('angle3').textContent=fmt(a3,4)+'\u00B0'; var angles=[a1,a2,a3]; var maxA=Math.max.apply(null,angles); var type=''; if(Math.abs(maxA-90)<0.0001) type='Right Triangle'; else if(maxA>90) type='Obtuse Triangle'; else type='Acute Triangle'; if(Math.abs(a1-a2)<0.0001&&Math.abs(a2-a3)<0.0001) type+=' (Equilateral)'; else if(Math.abs(a1-a2)<0.0001||Math.abs(a1-a3)<0.0001||Math.abs(a2-a3)<0.0001) type+=' (Isosceles)'; else type+=' (Scalene)'; document.getElementById('triangleType').textContent=type; document.getElementById('isValid').textContent='Yes \u2014 '+fmt(a1,2)+'\u00B0 + '+fmt(a2,2)+'\u00B0 + '+fmt(a3,2)+'\u00B0 = 180\u00B0';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['angle1', 'angle2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
