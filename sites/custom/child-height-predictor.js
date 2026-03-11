(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var dad=f('dadHeight');var mom=f('momHeight');var boy=f('childSex')===1;var mid=(dad+mom)/2;var predicted=boy?mid+2.5:mid-2.5;var lo=predicted-2;var hi=predicted+2;var ft=Math.floor(predicted/12);var inc=Math.round(predicted%12);var _r = {predicted:fmt(predicted,1)+' inches',range:fmt(lo,1)+' - '+fmt(hi,1)+' inches',feetInches:ft+"'"+inc+'"'};

    document.getElementById('predicted').textContent = _r.predicted;
    document.getElementById('range').textContent = _r.range;
    document.getElementById('feetInches').textContent = _r.feetInches;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['dadHeight', 'momHeight', 'childSex'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
