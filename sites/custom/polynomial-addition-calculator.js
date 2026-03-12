(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a1 = parseFloat(document.getElementById('a1').value) || 0;
    var b1 = parseFloat(document.getElementById('b1').value) || 0;
    var c1 = parseFloat(document.getElementById('c1').value) || 0;
    var a2 = parseFloat(document.getElementById('a2').value) || 0;
    var b2 = parseFloat(document.getElementById('b2').value) || 0;
    var c2 = parseFloat(document.getElementById('c2').value) || 0;

    // Calculation logic
    var sa=a1+a2;var sb=b1+b2;var sc=c1+c2;document.getElementById('sumA').textContent=sa;document.getElementById('sumB').textContent=sb;document.getElementById('sumC').textContent=sc;var parts=[];if(sa!==0)parts.push(sa+'x²');if(sb!==0)parts.push((sb>0&&parts.length?'+ ':'')+sb+'x');if(sc!==0)parts.push((sc>0&&parts.length?'+ ':'')+sc);document.getElementById('polynomial').textContent=parts.length?parts.join(' '):'0';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a1', 'b1', 'c1', 'a2', 'b2', 'c2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
