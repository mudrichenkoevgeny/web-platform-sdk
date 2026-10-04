const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('packages');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  if (file.endsWith('UseCase.ts')) {
    newContent = newContent.replace(/public async invoke\(/g, 'public async execute(');
  }

  // Update caller code
  newContent = newContent.replace(/\.invoke\(/g, '.execute(');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated: ' + file);
  }
});
