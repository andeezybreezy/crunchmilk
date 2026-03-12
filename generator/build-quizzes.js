#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// Paths
const ROOT = path.resolve(__dirname, '..');
const QUIZZES_DIR = path.join(ROOT, 'sites', 'quizzes');
const TEMPLATE_PATH = path.join(ROOT, 'generator', 'templates', 'quiz.html');
const OUTPUT_DIR = path.join(ROOT, 'output');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Replace all {{placeholder}} tokens in the template.
 */
function renderTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, function(match, key) {
    if (vars.hasOwnProperty(key)) {
      return vars[key];
    }
    return match;
  });
}

/**
 * Build the quiz HTML (start screen + question slides + result screen).
 */
function buildQuizHTML(config) {
  const questions = config.questions || [];
  const totalQ = questions.length;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  let html = '';

  // Start screen
  html += '<!-- Start Screen -->\n';
  html += '<div id="quizStart" class="quiz-start">\n';
  html += '  <div class="quiz-start-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>\n';
  html += '  <h2>' + escapeHtml(config.quizName) + '</h2>\n';
  html += '  <p>' + escapeHtml(config.tagline) + '</p>\n';
  html += '  <div class="quiz-start-meta">\n';
  html += '    <div class="quiz-start-meta-item"><div class="quiz-start-meta-val">' + totalQ + '</div><div class="quiz-start-meta-label">Questions</div></div>\n';
  html += '    <div class="quiz-start-meta-item"><div class="quiz-start-meta-val">~2 min</div><div class="quiz-start-meta-label">Duration</div></div>\n';
  html += '    <div class="quiz-start-meta-item"><div class="quiz-start-meta-val">Free</div><div class="quiz-start-meta-label">No signup</div></div>\n';
  html += '  </div>\n';
  html += '  <button type="button" class="start-btn" onclick="startQuiz()">Start Quiz <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></button>\n';
  html += '</div>\n\n';

  // Progress bar (hidden initially)
  html += '<!-- Progress -->\n';
  html += '<div id="quizProgress" class="progress-wrap" style="display:none">\n';
  html += '  <div class="progress-header">\n';
  html += '    <span class="progress-label">Progress</span>\n';
  html += '    <span class="progress-count" id="progressCount">1 / ' + totalQ + '</span>\n';
  html += '  </div>\n';
  html += '  <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>\n';
  html += '</div>\n\n';

  // Questions
  html += '<!-- Questions -->\n';
  html += '<div id="quizQuestions" class="question-container" style="display:none">\n';
  questions.forEach(function(q, qi) {
    html += '  <div class="question-slide" data-q="' + qi + '">\n';
    html += '    <div class="question-number">Question ' + (qi + 1) + ' of ' + totalQ + '</div>\n';
    html += '    <div class="question-text">' + escapeHtml(q.question) + '</div>\n';
    html += '    <div class="options-list">\n';
    (q.options || []).forEach(function(opt, oi) {
      html += '      <button type="button" class="option-btn" data-q="' + qi + '" data-score="' + (opt.score || 0) + '" onclick="selectOption(this)">\n';
      html += '        <span class="option-letter">' + (letters[oi] || (oi + 1)) + '</span>\n';
      html += '        <span class="option-label">' + escapeHtml(opt.text) + '</span>\n';
      html += '      </button>\n';
    });
    html += '    </div>\n';
    html += '  </div>\n';
  });
  html += '</div>\n\n';

  // Result screen
  html += '<!-- Result -->\n';
  html += '<div id="quizResult" class="quiz-result">\n';
  html += '  <div class="score-gauge">\n';
  html += '    <svg viewBox="0 0 160 160">\n';
  html += '      <circle class="gauge-bg" cx="80" cy="80" r="70"/>\n';
  html += '      <circle class="gauge-fill" id="gaugeFill" cx="80" cy="80" r="70"/>\n';
  html += '    </svg>\n';
  html += '    <div class="gauge-center">\n';
  html += '      <div class="score-number" id="scoreNumber">0</div>\n';
  html += '      <div class="score-of">out of 100</div>\n';
  html += '    </div>\n';
  html += '  </div>\n';
  html += '  <div class="result-label-badge" id="resultLabel">--</div>\n';
  html += '  <div class="result-analysis" id="resultAnalysis"></div>\n';
  html += '  <div class="result-cta">\n';
  html += '    <p id="resultCtaText">Ready to take the next step? Try our recommended tool.</p>\n';
  html += '    <a href="' + escapeHtml(config.targetTool || '/') + '" class="cta-btn">Try ' + escapeHtml(config.targetToolName || 'Calculator') + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a>\n';
  html += '  </div>\n';
  html += '  <div class="share-section">\n';
  html += '    <div class="share-title">Share your score</div>\n';
  html += '    <div class="share-buttons" id="shareButtons"></div>\n';
  html += '  </div>\n';
  html += '  <button type="button" class="retake-btn" onclick="retakeQuiz()">Retake Quiz</button>\n';
  html += '</div>\n';

  return html;
}

/**
 * Build the quiz JS logic.
 */
function buildQuizJS(config) {
  const questions = config.questions || [];
  const totalQ = questions.length;
  const maxRaw = totalQ * 4; // max possible raw score (each question max 4)
  const minRaw = totalQ * 1; // min possible raw score (each question min 1)

  const scoreRangesJSON = JSON.stringify(config.scoreRanges || []);
  const quizNameEsc = (config.quizName || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
  const slugEsc = (config.slug || '').replace(/'/g, "\\'");
  const domainEsc = (config.domain || 'crunchmilk.com').replace(/'/g, "\\'");
  const targetToolNameEsc = (config.targetToolName || 'Calculator').replace(/'/g, "\\'");

  return `(function(){
  var totalQuestions = ${totalQ};
  var maxRaw = ${maxRaw};
  var minRaw = ${minRaw};
  var scoreRanges = ${scoreRangesJSON};
  var currentQ = 0;
  var answers = [];
  var slides = [];
  var quizStarted = false;

  function $(id){ return document.getElementById(id); }

  window.startQuiz = function(){
    $('quizStart').style.display = 'none';
    $('quizProgress').style.display = 'block';
    $('quizQuestions').style.display = 'block';
    slides = document.querySelectorAll('.question-slide');
    currentQ = 0;
    answers = [];
    showQuestion(0);
  };

  function showQuestion(idx){
    slides.forEach(function(s,i){
      s.classList.remove('active','exit-left');
      if(i < idx) s.classList.add('exit-left');
    });
    if(slides[idx]) slides[idx].classList.add('active');
    var pct = ((idx) / totalQuestions) * 100;
    $('progressFill').style.width = pct + '%';
    $('progressCount').textContent = (idx + 1) + ' / ' + totalQuestions;
  }

  window.selectOption = function(btn){
    if(!btn || btn.classList.contains('selected')) return;
    var qi = parseInt(btn.getAttribute('data-q'));
    var score = parseInt(btn.getAttribute('data-score'));

    // Mark selected
    var siblings = btn.parentNode.querySelectorAll('.option-btn');
    siblings.forEach(function(b){ b.classList.remove('selected'); });
    btn.classList.add('selected');

    // Store answer
    answers[qi] = score;

    // Auto-advance after brief delay
    setTimeout(function(){
      if(qi < totalQuestions - 1){
        currentQ = qi + 1;
        showQuestion(currentQ);
      } else {
        showResult();
      }
    }, 350);
  };

  function showResult(){
    // Calculate raw score
    var rawScore = 0;
    for(var i = 0; i < answers.length; i++){
      rawScore += (answers[i] || 1);
    }

    // Normalize to 0-100
    var normalized = Math.round(((rawScore - minRaw) / (maxRaw - minRaw)) * 100);
    normalized = Math.max(0, Math.min(100, normalized));

    // Hide quiz, show result
    $('quizProgress').style.display = 'none';
    $('quizQuestions').style.display = 'none';
    $('quizResult').classList.add('visible');

    // Animate score gauge
    var circumference = 2 * Math.PI * 70; // r=70
    var offset = circumference - (normalized / 100) * circumference;
    var gaugeFill = $('gaugeFill');
    gaugeFill.style.strokeDasharray = circumference;
    gaugeFill.style.strokeDashoffset = circumference;
    setTimeout(function(){
      gaugeFill.style.strokeDashoffset = offset;
    }, 100);

    // Animate score number
    animateNumber($('scoreNumber'), 0, normalized, 1000);

    // Find matching range
    var label = '';
    var analysis = '';
    for(var i = 0; i < scoreRanges.length; i++){
      if(normalized >= scoreRanges[i].min && normalized <= scoreRanges[i].max){
        label = scoreRanges[i].label;
        analysis = scoreRanges[i].analysis;
        break;
      }
    }
    $('resultLabel').textContent = label;
    $('resultAnalysis').textContent = analysis;

    // Build share buttons
    var shareUrl = 'https://${domainEsc}/${slugEsc}/';
    var shareText = 'I scored ' + normalized + '/100 on the ${quizNameEsc}! Try it yourself:';
    var encodedText = encodeURIComponent(shareText);
    var encodedUrl = encodeURIComponent(shareUrl);

    var shareHTML = '';
    shareHTML += '<a href="https://twitter.com/intent/tweet?text=' + encodedText + '&url=' + encodedUrl + '" target="_blank" rel="noopener" class="share-btn share-btn-x"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> Post</a>';
    shareHTML += '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '" target="_blank" rel="noopener" class="share-btn share-btn-fb"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Share</a>';
    shareHTML += '<a href="https://reddit.com/submit?url=' + encodedUrl + '&title=' + encodedText + '" target="_blank" rel="noopener" class="share-btn share-btn-reddit"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 000-.462.342.342 0 00-.461 0c-.545.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.345.345 0 00-.206-.095z"/></svg> Reddit</a>';
    shareHTML += '<button type="button" class="share-btn share-btn-copy" onclick="copyScore()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</button>';

    $('shareButtons').innerHTML = shareHTML;

    // Scroll to top of result
    $('quizResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function animateNumber(el, start, end, duration){
    var startTime = null;
    function step(timestamp){
      if(!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(start + (end - start) * eased);
      if(progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  window.copyScore = function(){
    var text = 'I scored ' + $('scoreNumber').textContent + '/100 on the ${quizNameEsc}! Try it: https://${domainEsc}/${slugEsc}/';
    if(navigator.clipboard){
      navigator.clipboard.writeText(text).then(function(){
        var btn = document.querySelector('.share-btn-copy');
        if(btn){ var orig = btn.innerHTML; btn.innerHTML = btn.innerHTML.replace('Copy','Copied!'); setTimeout(function(){ btn.innerHTML = orig; }, 2000); }
      });
    }
  };

  window.retakeQuiz = function(){
    $('quizResult').classList.remove('visible');
    $('quizResult').style.display = 'none';
    // Reset all option buttons
    document.querySelectorAll('.option-btn').forEach(function(b){ b.classList.remove('selected'); });
    // Reset gauge
    $('gaugeFill').style.strokeDashoffset = 2 * Math.PI * 70;
    $('scoreNumber').textContent = '0';
    // Show start screen
    $('quizStart').style.display = 'block';
    $('quizStart').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
})();`;
}

// ---------------------------------------------------------------------------
// Main build
// ---------------------------------------------------------------------------

function buildQuiz(configFile) {
  const configPath = path.join(QUIZZES_DIR, configFile);
  const configRaw = fs.readFileSync(configPath, 'utf8');
  const config = JSON.parse(configRaw);
  const slug = config.slug;

  console.log('  Building quiz: ' + slug);

  // Read template
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Build generated sections
  const quizHTML = buildQuizHTML(config);
  const quizJS = buildQuizJS(config);

  // Template variables
  const vars = {
    title: config.title || config.quizName + ' | CrunchMilk',
    metaDescription: config.metaDescription || config.tagline || '',
    slug: config.slug,
    domain: config.domain || 'crunchmilk.com',
    quizName: config.quizName,
    tagline: config.tagline || '',
    primaryColor: config.primaryColor || '#2563eb',
    primaryDarkColor: config.primaryDarkColor || '#1d4ed8',
    quizHTML: quizHTML,
    quizJS: quizJS,
    year: new Date().getFullYear().toString()
  };

  const html = renderTemplate(template, vars);

  // Write output
  const outputPath = path.join(OUTPUT_DIR, slug);
  fs.mkdirSync(outputPath, { recursive: true });
  const outputFile = path.join(outputPath, 'index.html');
  fs.writeFileSync(outputFile, html, 'utf8');

  console.log('    -> output/' + slug + '/index.html');
}

function main() {
  const targetSlug = process.argv[2]; // optional: build a single quiz

  console.log('CrunchMilk Quiz Builder');
  console.log('=======================\n');

  // Ensure directories exist
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  if (!fs.existsSync(QUIZZES_DIR)) {
    console.log('No quizzes directory found at ' + QUIZZES_DIR);
    process.exit(0);
  }

  if (targetSlug) {
    const configFile = targetSlug + '.json';
    const configPath = path.join(QUIZZES_DIR, configFile);
    if (!fs.existsSync(configPath)) {
      console.error('ERROR: Quiz config not found: ' + configPath);
      process.exit(1);
    }
    buildQuiz(configFile);
  } else {
    const configFiles = fs.readdirSync(QUIZZES_DIR).filter(function(f) {
      return f.endsWith('.json');
    });
    if (configFiles.length === 0) {
      console.log('No quiz config files found in ' + QUIZZES_DIR);
      process.exit(0);
    }
    console.log('Found ' + configFiles.length + ' quiz config(s)\n');
    configFiles.forEach(buildQuiz);
  }

  console.log('\nDone!');
}

main();
