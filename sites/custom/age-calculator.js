(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var birthYear = parseFloat(document.getElementById('birthYear').value) || 0;
    var birthMonth = parseFloat(document.getElementById('birthMonth').value) || 0;
    var birthDay = parseFloat(document.getElementById('birthDay').value) || 0;

    // Calculation logic
    var now = new Date(); var birth = new Date(birthYear, birthMonth - 1, birthDay); var years = now.getFullYear() - birthYear; if (now.getMonth() < birthMonth - 1 || (now.getMonth() === birthMonth - 1 && now.getDate() < birthDay)) years--; var months = years * 12 + now.getMonth() - (birthMonth - 1); if (now.getDate() < birthDay) months--; var days = Math.floor((now - birth) / (1000*60*60*24)); var nextBday = new Date(now.getFullYear(), birthMonth - 1, birthDay); if (nextBday < now) nextBday = new Date(now.getFullYear() + 1, birthMonth - 1, birthDay); var nextBirthday = Math.ceil((nextBday - now) / (1000*60*60*24));     document.getElementById('years').textContent = fmt(years,0);
    document.getElementById('months').textContent = fmt(months,0);
    document.getElementById('days').textContent = fmt(days,0);
    document.getElementById('nextBirthday').textContent = fmt(nextBirthday,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['birthYear', 'birthMonth', 'birthDay'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
