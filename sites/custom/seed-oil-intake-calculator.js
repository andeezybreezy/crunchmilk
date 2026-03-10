(function() {
  'use strict';

  // Seed oil in grams per day from each source
  // Restaurant meals: ~30g seed oil per meal average
  var restaurantOilPerMeal = 30;
  // Home cooking with seed oil: ~14g per meal (1 tbsp)
  var homeSeedOilPerMeal = 14;
  // Packaged food: ~7g per serving
  var packagedOilPerServing = 7;
  // Fried/snack food: ~20g per serving
  var snackOilPerServing = 20;
  // Dressings/sauces: ~10g per serving
  var dressingOilPerServing = 10;

  // Linoleic acid is ~50-55% of common seed oils
  var laRatio = 0.52;
  // Calories per gram of oil
  var calPerGram = 9;

  var chartData = [
    ['French fries (large)','3-4','12-16','360-480','Soybean/Canola'],
    ['Potato chips (bag)','2-3','8-12','240-360','Sunflower/Corn'],
    ['Restaurant stir fry','2-3','8-12','240-360','Soybean'],
    ['Commercial mayo (2 tbsp)','1.5','6','180','Soybean'],
    ['Salad dressing (2 tbsp)','1','4','120','Soybean/Canola'],
    ['Packaged cookies (3)','0.5-1','2-4','60-120','Soybean/Palm'],
    ['Bread (2 slices)','0.3','1.2','36','Soybean'],
    ['Granola bar','0.5','2','60','Canola/Sunflower']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var restMeals = parseInt(document.getElementById('restaurantMeals').value, 10);
    var cookOil = document.getElementById('cookingOil').value;
    var packaged = parseInt(document.getElementById('packagedFoods').value, 10);
    var snacks = parseInt(document.getElementById('snackFreq').value, 10);
    var dressings = parseInt(document.getElementById('dressings').value, 10);

    // Restaurant oil per day
    var restOilDaily = (restMeals / 7) * restaurantOilPerMeal;

    // Home cooking oil per day
    // Assume ~2 home-cooked meals per day minus restaurant meals
    var homeMealsPerDay = Math.max(0, 2.5 - (restMeals / 7));
    var homeOilDaily = 0;
    if (cookOil === 'seed') {
      homeOilDaily = homeMealsPerDay * homeSeedOilPerMeal;
    } else if (cookOil === 'olive' || cookOil === 'avocado') {
      homeOilDaily = homeMealsPerDay * 1; // minimal seed oil, trace from other sources
    } else if (cookOil === 'butter' || cookOil === 'coconut') {
      homeOilDaily = homeMealsPerDay * 0.5; // negligible seed oil
    } else {
      homeOilDaily = 0;
    }

    // Packaged foods per day
    var packagedOilDaily = packaged * packagedOilPerServing;

    // Snacks per day
    var snackOilDaily = (snacks / 7) * snackOilPerServing;

    // Dressings per day
    var dressingOilDaily = dressings * dressingOilPerServing;

    var totalDaily = restOilDaily + homeOilDaily + packagedOilDaily + snackOilDaily + dressingOilDaily;
    var dailyLA = totalDaily * laRatio;
    var annualOil = totalDaily * 365;
    var dailyCal = totalDaily * calPerGram;

    // Estimate omega-6:omega-3 ratio
    // Average omega-3 intake ~1.5g/day
    var omega3 = 1.5;
    var omega6 = dailyLA;
    var ratioVal = omega3 > 0 ? Math.round(omega6 / omega3) : 0;

    // Intake level
    var level, levelColor;
    if (totalDaily <= 15) {
      level = 'Low'; levelColor = '#16a34a';
    } else if (totalDaily <= 35) {
      level = 'Moderate'; levelColor = '#ca8a04';
    } else if (totalDaily <= 60) {
      level = 'High'; levelColor = '#ea580c';
    } else {
      level = 'Very High'; levelColor = '#dc2626';
    }

    // Display
    var tbsp = (totalDaily / 14).toFixed(1);
    document.getElementById('dailyOil').textContent = Math.round(totalDaily) + 'g (~' + tbsp + ' tbsp)';
    document.getElementById('dailyLA').textContent = Math.round(dailyLA) + 'g linoleic acid';
    document.getElementById('annualOil').textContent = (annualOil / 1000).toFixed(1) + ' kg (' + (annualOil / 454).toFixed(1) + ' lbs)';
    document.getElementById('oilCalories').textContent = Math.round(dailyCal) + ' cal/day (' + Math.round(dailyCal / 20) + '% of 2,000)';
    document.getElementById('ratio').textContent = ratioVal + ':1 omega-6:omega-3';
    document.getElementById('intakeLevel').textContent = level;
    document.getElementById('intakeLevel').style.color = levelColor;

    var tip = 'Estimated ' + Math.round(totalDaily) + 'g of seed oil per day. ';
    if (totalDaily > 40) {
      tip += 'This is above average. Restaurant meals and packaged foods are typically the biggest sources. ';
    } else if (totalDaily < 20) {
      tip += 'This is below the American average. ';
    }
    tip += 'The health impact of seed oil consumption is actively debated — consult your healthcare provider.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
