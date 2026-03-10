(function() {
  'use strict';

  var chartData = [
    ['Spaghetti', '2 oz (56g)', '4 oz (113g)', '2x', '8-10 min'],
    ['Penne', '2 oz (56g)', '4.5 oz (127g)', '2.25x', '10-12 min'],
    ['Rigatoni', '2 oz (56g)', '4.5 oz (127g)', '2.25x', '12-14 min'],
    ['Farfalle', '2 oz (56g)', '4 oz (113g)', '2x', '10-12 min'],
    ['Fusilli', '2 oz (56g)', '4 oz (113g)', '2x', '10-12 min'],
    ['Fettuccine', '2 oz (56g)', '4 oz (113g)', '2x', '10-12 min'],
    ['Angel Hair', '2 oz (56g)', '4 oz (113g)', '2x', '3-5 min'],
    ['Elbow Macaroni', '2 oz (56g)', '5 oz (142g)', '2.5x', '8-10 min'],
    ['Orzo', '2 oz (56g)', '5 oz (142g)', '2.5x', '8-10 min'],
    ['Lasagna Sheets', '2.5 oz (71g)', '5 oz (142g)', '2x', '8-10 min'],
    ['Ravioli (fresh)', '5 oz (142g)', '5.5 oz (156g)', '1.1x', '3-5 min']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // Pasta data: [dryOzPerPerson, expansionMultiplier, cookTimeStr]
  var pastaData = {
    spaghetti:   [2.0, 2.0, '8-10 min'],
    penne:       [2.0, 2.25, '10-12 min'],
    farfalle:    [2.0, 2.0, '10-12 min'],
    fusilli:     [2.0, 2.0, '10-12 min'],
    macaroni:    [2.0, 2.5, '8-10 min'],
    fettuccine:  [2.0, 2.0, '10-12 min'],
    angel:       [2.0, 2.0, '3-5 min'],
    orzo:        [2.0, 2.5, '8-10 min'],
    lasagna:     [2.5, 2.0, '8-10 min'],
    ravioli:     [5.0, 1.1, '3-5 min']
  };

  var courseMultipliers = { main: 1.0, side: 0.6, appetizer: 0.5 };
  var appetiteMultipliers = { light: 0.8, normal: 1.0, hungry: 1.4 };

  function calculate() {
    var people = parseFloat(document.getElementById('people').value);
    var pastaType = document.getElementById('pastaType').value;
    var courseType = document.getElementById('courseType').value;
    var appetite = document.getElementById('appetite').value;

    if (isNaN(people) || people <= 0) return;

    var pd = pastaData[pastaType] || pastaData.spaghetti;
    var baseDryOz = pd[0];
    var expansion = pd[1];
    var cookTime = pd[2];

    var courseMult = courseMultipliers[courseType];
    var appMult = appetiteMultipliers[appetite];

    var dryPerPerson = baseDryOz * courseMult * appMult;
    var dryTotal = dryPerPerson * people;
    var cookedTotal = dryTotal * expansion;

    // Convert to grams as well (1 oz = 28.35g)
    var dryPerPersonG = Math.round(dryPerPerson * 28.35);
    var dryTotalG = Math.round(dryTotal * 28.35);
    var cookedTotalG = Math.round(cookedTotal * 28.35);

    // Water: 4-6 quarts per pound (16 oz) of pasta
    var dryPounds = dryTotal / 16;
    var waterQuarts = Math.ceil(dryPounds * 5); // 5 quarts per lb
    if (waterQuarts < 2) waterQuarts = 2;

    // Sauce: ~0.5 cups per serving (main course)
    var sauceCups = Math.round(people * 0.5 * courseMult * 10) / 10;
    var sauceOz = Math.round(sauceCups * 4); // 4 oz per half cup

    document.getElementById('dryTotal').textContent = dryTotal.toFixed(1) + ' oz (' + dryTotalG + 'g)';
    document.getElementById('dryPer').textContent = dryPerPerson.toFixed(1) + ' oz (' + dryPerPersonG + 'g)';
    document.getElementById('cookedTotal').textContent = cookedTotal.toFixed(1) + ' oz (' + cookedTotalG + 'g)';
    document.getElementById('waterNeeded').textContent = waterQuarts + ' quarts';
    document.getElementById('sauceNeeded').textContent = sauceCups + ' cups (' + sauceOz + ' oz)';
    document.getElementById('cookTime').textContent = cookTime;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  document.getElementById('people').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });

})();
