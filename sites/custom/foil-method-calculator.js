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
    var d = parseFloat(document.getElementById('d').value) || 0;

    // Calculation logic
    var F=a*c;var O=a*d;var I=b*c;var L=b*d;var mid=O+I;var s='F: '+a+'·'+c+'='+F+' | O: '+a+'·('+d+')='+O+' | I: '+b+'·'+c+'='+I+' | L: '+b+'·('+d+')='+L;document.getElementById('steps').textContent=s;document.getElementById('expanded').textContent=F+'x² + '+O+'x + '+I+'x + '+L;var midStr=mid>=0?' + '+mid:' - '+Math.abs(mid);var LStr=L>=0?' + '+L:' - '+Math.abs(L);document.getElementById('simplified').textContent=F+'x²'+midStr+'x'+LStr;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a', 'b', 'c', 'd'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
