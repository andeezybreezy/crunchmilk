#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const CONFIGS_DIR = path.resolve(__dirname, '..', 'sites', 'configs');
const configFiles = fs.readdirSync(CONFIGS_DIR).filter(f => f.endsWith('.json'));

let fixed = 0;

configFiles.forEach(function(file) {
  const filePath = path.join(CONFIGS_DIR, file);
  let config;
  try { config = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch (e) { return; }

  const title = config.title || '';
  if (title.length <= 70) return;

  // Strategy: shorten the part after the em dash
  let newTitle = title;

  // Remove "Calculator" suffix if after dash
  if (newTitle.length > 70 && newTitle.includes(' — ')) {
    const parts = newTitle.split(' — ');
    // Shorten the subtitle
    let sub = parts[1] || '';
    sub = sub.replace(/\s+Calculator$/i, '').replace(/\s+Estimator$/i, '').replace(/\s+Converter$/i, '');
    newTitle = parts[0] + ' — ' + sub;
  }

  // If still too long, drop the subtitle entirely
  if (newTitle.length > 70 && newTitle.includes(' — ')) {
    newTitle = newTitle.split(' — ')[0];
  }

  // If STILL too long, truncate
  if (newTitle.length > 70) {
    newTitle = newTitle.substring(0, 67) + '...';
  }

  if (newTitle !== title) {
    config.title = newTitle;
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n', 'utf8');
    fixed++;
    console.log('  Fixed: ' + title + ' -> ' + newTitle + ' (' + newTitle.length + ')');
  }
});

console.log('\nFixed ' + fixed + ' titles.');
