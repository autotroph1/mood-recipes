#!/usr/bin/env node
/**
 * Deploy script: stages, commits, and pushes changes to trigger Render auto-deploy.
 * Run: npm run deploy
 * Or with message: npm run deploy -- "your commit message"
 */

const { execSync } = require('child_process');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const rawMsg = process.argv.slice(2).join(' ') || `Deploy: ${new Date().toISOString().slice(0, 10)}`;
const message = rawMsg.replace(/"/g, "'");

try {
  process.chdir(repoRoot);
  execSync('git add -A', { stdio: 'inherit' });
  const status = execSync('git status --short', { encoding: 'utf8' });
  if (!status.trim()) {
    console.log('No changes to deploy.');
    process.exit(0);
  }
  execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log('\n✓ Pushed to GitHub. Render will auto-deploy in 2–3 minutes.');
} catch (err) {
  if (err.status === 128) {
    console.error('\nPush failed: Git needs your GitHub credentials.');
    console.error('Run "git push" manually in your terminal.');
  } else {
    console.error(err.message);
  }
  process.exit(1);
}
