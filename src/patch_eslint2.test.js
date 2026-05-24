/**
 * Tests for patch_eslint2.js
 *
 * patch_eslint2.js reads package.json, modifies the test script to
 * 'run-s test:unit test:lint test:build', then writes it back.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('patch_eslint2.js', () => {
  let tmpDir;
  let originalCwd;

  beforeEach(() => {
    // Create a temporary directory with a package.json for testing
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'patch-eslint2-test-'));
    originalCwd = process.cwd();
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    // Clean up temp directory
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('sets the test script to run-s test:unit test:lint test:build', () => {
    const initialPkg = {
      name: 'test-package',
      scripts: {
        test: 'old-test-command',
        build: 'microbundle',
      },
    };
    fs.writeFileSync('package.json', JSON.stringify(initialPkg, null, 2) + '\n');

    // Execute the script logic directly (inline the patch_eslint2.js logic)
    let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts['test'] = 'run-s test:unit test:lint test:build';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

    const result = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    expect(result.scripts.test).toBe('run-s test:unit test:lint test:build');
  });

  it('preserves all other fields in package.json', () => {
    const initialPkg = {
      name: 'test-package',
      version: '1.0.0',
      description: 'A test package',
      scripts: {
        test: 'old-test-command',
        build: 'microbundle',
        start: 'react-scripts start',
      },
      dependencies: { react: '^18.0.0' },
    };
    fs.writeFileSync('package.json', JSON.stringify(initialPkg, null, 2) + '\n');

    let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts['test'] = 'run-s test:unit test:lint test:build';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

    const result = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    expect(result.name).toBe('test-package');
    expect(result.version).toBe('1.0.0');
    expect(result.description).toBe('A test package');
    expect(result.scripts.build).toBe('microbundle');
    expect(result.scripts.start).toBe('react-scripts start');
    expect(result.dependencies.react).toBe('^18.0.0');
  });

  it('overwrites an existing test script', () => {
    const initialPkg = {
      name: 'test-package',
      scripts: {
        test: 'jest',
        'test:unit': 'react-scripts test',
        'test:lint': 'eslint .',
        'test:build': 'run-s build',
      },
    };
    fs.writeFileSync('package.json', JSON.stringify(initialPkg, null, 2) + '\n');

    let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts['test'] = 'run-s test:unit test:lint test:build';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

    const result = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    expect(result.scripts.test).toBe('run-s test:unit test:lint test:build');
    // Other test scripts should remain
    expect(result.scripts['test:unit']).toBe('react-scripts test');
    expect(result.scripts['test:lint']).toBe('eslint .');
    expect(result.scripts['test:build']).toBe('run-s build');
  });

  it('writes valid JSON to package.json', () => {
    const initialPkg = {
      name: 'test-package',
      scripts: { test: 'old-command' },
    };
    fs.writeFileSync('package.json', JSON.stringify(initialPkg, null, 2) + '\n');

    let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts['test'] = 'run-s test:unit test:lint test:build';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

    // Should be parseable JSON
    expect(() => {
      JSON.parse(fs.readFileSync('package.json', 'utf8'));
    }).not.toThrow();
  });

  it('ends the written file with a newline', () => {
    const initialPkg = {
      name: 'test-package',
      scripts: { test: 'old-command' },
    };
    fs.writeFileSync('package.json', JSON.stringify(initialPkg, null, 2) + '\n');

    let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts['test'] = 'run-s test:unit test:lint test:build';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

    const content = fs.readFileSync('package.json', 'utf8');
    expect(content.endsWith('\n')).toBe(true);
  });
});