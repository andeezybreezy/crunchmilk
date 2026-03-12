(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalFeet = parseFloat(document.getElementById('totalFeet').value) || 0;
    var fenceHeight = parseFloat(document.getElementById('fenceHeight').value) || 0;
    var postSpacing = parseFloat(document.getElementById('postSpacing').value) || 0;

    // Calculation logic
    var sections=Math.ceil(totalFeet/postSpacing); var posts=sections+1; var rails=sections*2; var pickets=Math.ceil(totalFeet/(3.5/12)); var concreteBags=posts*2; var postCost=posts*12; var railCost=rails*8; var picketCost=pickets*2.5; var concreteCost=concreteBags*5; var cost=postCost+railCost+picketCost+concreteCost;     document.getElementById('posts').textContent = posts+' posts';
    document.getElementById('rails').textContent = rails+' rails';
    document.getElementById('pickets').textContent = pickets+' pickets';
    document.getElementById('concrete').textContent = concreteBags+' bags';
    document.getElementById('cost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalFeet', 'fenceHeight', 'postSpacing'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
