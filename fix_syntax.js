const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(p, 'utf8');

// The issue we have is literal `\`` and `\${` in the file.
// Let's replace literally "\`" with "`" and "\${" with "${"
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$\{/g, '${');

fs.writeFileSync(p, content, 'utf8');
console.log('App.jsx syntax fixed!');
