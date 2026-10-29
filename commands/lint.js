const path = require('node:path');
const { spawnSync } = require('node:child_process');

module.exports = async function lint(args = []) {
  const eslintEntry = require.resolve('eslint');
  const eslintPackageDirectory = path.resolve(
    path.dirname(eslintEntry),
    '..'
  );

  const eslintCli = path.join(
    eslintPackageDirectory,
    'bin',
    'eslint.js'
  );

  const configPath = path.resolve(
    __dirname,
    '../eslint.config.mjs'
  );

  const result = spawnSync(
    process.execPath,
    [
      eslintCli,
      '--config',
      configPath,
      '.',
      ...args,
    ],
    {
      cwd: process.cwd(),
      stdio: 'inherit',
    }
  );

  if (result.error) {
    throw result.error;
  }

  process.exitCode = result.status ?? 1;
};