(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var breedSize = document.getElementById('breedSize').value;
    var lifespan = parseFloat(document.getElementById('lifespan').value) || 0;
    var foodQuality = document.getElementById('foodQuality').value;
    var insurance = document.getElementById('insurance').value;
    var grooming = document.getElementById('grooming').value;
    var training = document.getElementById('training').value;

    // Calculation logic
    var monthlyFood = {small:{budget:30,premium:55,super:90,raw:120},medium:{budget:45,premium:75,super:130,raw:180},large:{budget:60,premium:100,super:175,raw:260},giant:{budget:80,premium:135,super:230,raw:350}}; var food = monthlyFood[breedSize][foodQuality] * 12 * lifespan; var annualVet = {small:350,medium:450,large:550,giant:650}; var vetBase = annualVet[breedSize] * lifespan; var seniorExtra = Math.max(0, lifespan - 8) * (breedSize === 'giant' ? 800 : breedSize === 'large' ? 600 : 400); var vet = vetBase + seniorExtra; var insuranceCost = {no:0,yes:{small:35,medium:45,large:55,giant:70},wellness:{small:60,medium:75,large:90,giant:110}}; var ins = insurance === 'no' ? 0 : (insuranceCost[insurance][breedSize] * 12 * lifespan); var groomCost = {low:150,moderate:600,high:1400}; var groom = groomCost[grooming] * lifespan; var trainCost = {none:50,basic:400,private:1500}; var train = trainCost[training]; var suppliesFirst = {small:350,medium:500,large:650,giant:800}; var suppliesAnnual = {small:150,medium:200,large:275,giant:350}; var supplies = suppliesFirst[breedSize] + suppliesAnnual[breedSize] * (lifespan - 1); var boarding = 300 * lifespan; var total = food + vet + ins + groom + train + supplies + boarding; var annual = total / lifespan; var monthly = annual / 12; var firstYear = monthlyFood[breedSize][foodQuality] * 12 + annualVet[breedSize] + suppliesFirst[breedSize] + trainCost[training] + (insurance === 'no' ? 0 : insuranceCost[insurance][breedSize] * 12) + groomCost[grooming] + 500; document.getElementById('lifetimeTotal').textContent = dollar(total); document.getElementById('annualCost').textContent = dollar(annual); document.getElementById('monthlyCost').textContent = dollar(monthly); document.getElementById('foodLifetime').textContent = dollar(food); document.getElementById('vetLifetime').textContent = dollar(vet); document.getElementById('firstYearCost').textContent = dollar(firstYear);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['breedSize', 'lifespan', 'foodQuality', 'insurance', 'grooming', 'training'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
