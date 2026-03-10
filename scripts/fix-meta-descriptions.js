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
  try {
    config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) { return; }

  let changed = false;

  if (config.metaDescription && config.metaDescription.length > 155) {
    // Truncate intelligently at word boundary
    let desc = config.metaDescription;
    if (desc.length > 155) {
      desc = desc.substring(0, 152);
      const lastSpace = desc.lastIndexOf(' ');
      if (lastSpace > 100) desc = desc.substring(0, lastSpace);
      desc = desc.replace(/[,.\s]+$/, '') + '.';
    }
    config.metaDescription = desc;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n', 'utf8');
    fixed++;
  }
});

console.log('Fixed ' + fixed + ' meta descriptions (of ' + configFiles.length + ' total configs).');
