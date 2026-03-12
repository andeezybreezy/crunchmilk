(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var number = parseFloat(document.getElementById('number').value) || 0;
    var place = document.getElementById('place').value;

    // Calculation logic
    var n=parseFloat(number);var placeMap={'ones':0,'tens':-1,'hundreds':-2,'tenths':1,'hundredths':2};var digits=placeMap[place];var factor,rounded;if(digits>=0){factor=Math.pow(10,digits);rounded=Math.round(n*factor)/factor;}else{factor=Math.pow(10,Math.abs(digits));rounded=Math.round(n/factor)*factor;}document.getElementById('rounded').textContent=fmt(rounded,Math.max(0,digits));var lookAt;if(place==='ones')lookAt='the tenths digit';else if(place==='tens')lookAt='the ones digit';else if(place==='hundreds')lookAt='the tens digit';else if(place==='tenths')lookAt='the hundredths digit';else lookAt='the thousandths digit';document.getElementById('explanation').textContent='Look at '+lookAt+'. If it is 5 or greater, round up. If less than 5, round down. '+n+' rounded to the nearest '+place+' is '+rounded+'.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['number', 'place'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
