const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('\\`')) {
      content = content.replace(/\\`/g, '`');
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${file}`);
    }
  }
});
