const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('UseCase.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('packages');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let matches = content.match(/public async execute\(/g);
  if (matches && matches.length > 1) {
    console.log('Duplicate execute found in: ' + file);
  }
});
