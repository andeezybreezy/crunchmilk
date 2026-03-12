(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var numbers = parseFloat(document.getElementById('numbers').value) || 0;

    // Calculation logic
    var nums=numbers.split(',').map(function(s){return parseFloat(s.trim());}).filter(function(n){return !isNaN(n);});if(nums.length===0){document.getElementById('mean').textContent='Please enter at least one number';return;}document.getElementById('count').textContent=nums.length;var sum=nums.reduce(function(a,b){return a+b;},0);document.getElementById('mean').textContent=fmt(sum/nums.length,4);var sorted=nums.slice().sort(function(a,b){return a-b;});var mid=Math.floor(sorted.length/2);var median=sorted.length%2===0?(sorted[mid-1]+sorted[mid])/2:sorted[mid];document.getElementById('median').textContent=fmt(median,4);var freq={};nums.forEach(function(n){freq[n]=(freq[n]||0)+1;});var maxFreq=Math.max.apply(null,Object.values(freq));var modes=Object.keys(freq).filter(function(k){return freq[k]===maxFreq;});if(maxFreq===1){document.getElementById('mode').textContent='No mode (all values appear once)';}else{document.getElementById('mode').textContent=modes.join(', ')+' (appears '+maxFreq+' times)';}document.getElementById('range').textContent=fmt(sorted[sorted.length-1]-sorted[0],4);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['numbers'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
