(function() {
  'use strict';

  var gradePoints = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  var courseEntries = document.getElementById('courseEntries');
  var addCourseBtn = document.getElementById('addCourseBtn');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function buildGradeOptions() {
    var opts = '';
    for (var g in gradePoints) {
      var sel = g === 'A' ? ' selected' : '';
      opts += '<option value="' + g + '"' + sel + '>' + g + ' (' + gradePoints[g].toFixed(1) + ')</option>';
    }
    return opts;
  }

  function addCourse(name, credits, grade) {
    var div = document.createElement('div');
    div.className = 'course-entry';
    div.style.cssText = 'display:flex;gap:8px;align-items:end;margin-bottom:10px;flex-wrap:wrap';
    div.innerHTML =
      '<div style="flex:1;min-width:100px"><label style="font-size:0.85rem">Course</label><input type="text" class="course-name" value="' + (name || '') + '" placeholder="Course name" style="width:100%;padding:10px;border:2px solid var(--border);border-radius:8px;font-size:0.95rem"></div>' +
      '<div style="flex:0 0 75px"><label style="font-size:0.85rem">Credits</label><input type="number" class="course-credits" value="' + (credits || 3) + '" min="0.5" max="12" step="0.5" inputmode="decimal" style="width:100%;padding:10px;border:2px solid var(--border);border-radius:8px;font-size:0.95rem"></div>' +
      '<div style="flex:0 0 110px"><label style="font-size:0.85rem">Grade</label><select class="course-grade" style="width:100%;padding:10px;border:2px solid var(--border);border-radius:8px;font-size:0.95rem;background:#fff">' + buildGradeOptions() + '</select></div>' +
      '<button type="button" class="remove-course-btn" style="padding:10px 14px;background:#fee2e2;color:#991b1b;border:2px solid #fecaca;border-radius:8px;cursor:pointer;font-weight:700" title="Remove">&times;</button>';
    if (grade) div.querySelector('.course-grade').value = grade;
    courseEntries.appendChild(div);
  }

  addCourseBtn.addEventListener('click', function() {
    addCourse('', 3, 'A');
  });

  courseEntries.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-course-btn')) {
      var entries = courseEntries.querySelectorAll('.course-entry');
      if (entries.length > 1) {
        e.target.closest('.course-entry').remove();
      }
    }
  });

  function calculate() {
    var entries = courseEntries.querySelectorAll('.course-entry');
    var semCredits = 0;
    var semPoints = 0;

    entries.forEach(function(entry) {
      var credits = parseFloat(entry.querySelector('.course-credits').value) || 0;
      var grade = entry.querySelector('.course-grade').value;
      var pts = gradePoints[grade];
      if (pts !== undefined && credits > 0) {
        semCredits += credits;
        semPoints += pts * credits;
      }
    });

    if (semCredits <= 0) return;

    var semGpa = semPoints / semCredits;

    // Cumulative
    var existGpa = parseFloat(document.getElementById('existingGpa').value) || 0;
    var existCredits = parseFloat(document.getElementById('existingCredits').value) || 0;
    var existPoints = existGpa * existCredits;

    var totalCredits = semCredits + existCredits;
    var totalPoints = semPoints + existPoints;
    var cumGpa = totalCredits > 0 ? totalPoints / totalCredits : semGpa;

    document.getElementById('semesterGpa').textContent = semGpa.toFixed(2);
    document.getElementById('cumulativeGpa').textContent = cumGpa.toFixed(2);
    document.getElementById('semCredits').textContent = semCredits;
    document.getElementById('totalCredits').textContent = totalCredits;

    var tip = semCredits + ' semester credits, ' + semPoints.toFixed(1) + ' grade points';
    if (existCredits > 0) {
      tip += ' | Prior: ' + existCredits + ' credits at ' + existGpa.toFixed(2) + ' GPA';
    }

    // Latin honors check
    if (cumGpa >= 3.9) tip += ' — Summa Cum Laude range';
    else if (cumGpa >= 3.7) tip += ' — Magna Cum Laude range';
    else if (cumGpa >= 3.5) tip += ' — Cum Laude range';

    document.getElementById('resultTip').textContent = tip;
    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);

  // Add initial 4 course rows
  addCourse('', 3, 'A');
  addCourse('', 3, 'B+');
  addCourse('', 4, 'A-');
  addCourse('', 3, 'B');

  calculate();
})();
