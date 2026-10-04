const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('packages');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Look for execute( or any method name followed by (
  // We can just count commas between ( and ) after "execute" or in interfaces

  const regex = /(public async execute|get[A-Za-z]+)\s*\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const args = match[2];
    const commaCount = (args.match(/,/g) || []).length;
    if (commaCount >= 2) {
      console.log(`Found ${commaCount + 1} args in ${file}: ${match[1]}`);
    }
  }
});
