const fs = require('fs');
const path = require('path');

const readPkgUp = require('read-pkg-up');
const arrify = require('arrify');
const { has } = require('lodash');
const which = require('which');

const { package: pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
});

const appDirectory = path.dirname(pkgPath);

const fromRoot = (...p) => path.join(appDirectory, ...p);

const hasPkgProp = props => arrify(props).some(prop => has(pkg, prop));

const hasFile = (...p) => fs.existsSync(fromRoot(...p));

function resolveBin(
  modName,
  { executable = modName, cwd = process.cwd() } = {}
) {
  let pathFromWhich;
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
    if (pathFromWhich && pathFromWhich.includes('.CMD')) {
      return pathFromWhich;
    }
  } catch (_error) {
    // ignore _error
  }
  try {
    const modPkgPath = require.resolve(`${modName}/package.json`);
    const modPkgDir = path.dirname(modPkgPath);
    const { bin } = require(modPkgPath);
    const binPath = typeof bin === 'string' ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);
    if (fullPathToBin === pathFromWhich) {
      return executable;
    }
    return fullPathToBin.replace(cwd, '.');
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }
    throw error;
  }
}

module.exports = {
  appDirectory,
  fromRoot,
  hasPkgProp,
  hasFile,
  resolveBin,
};
