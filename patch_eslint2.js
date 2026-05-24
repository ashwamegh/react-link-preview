const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts['test'] = 'run-s test:unit test:lint test:build';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
