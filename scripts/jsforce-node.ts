import fs from 'node:fs/promises';
import shelljs from 'shelljs';

type PJSON = {
  [k: string]: any;
  name: string;
  files: string[];
  dependencies?: { [name: string]: string };
  devDependencies?: { [name: string]: string };
};

async function readJson<T>(filePath: string): Promise<T> {
  const pjsonRaw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(pjsonRaw) as T;
}

function filterBrowserFiles(filePath: string): boolean {
  if (['browser', 'dist', 'src', 'core', 'api', 'bin'].includes(filePath))
    return false;
  return true;
}

(async function main() {
  const dev = process.argv.find((arg) => arg === '--dev');

  const pjson = await readJson<PJSON>('package.json');

  pjson.name = '@jsforce/jsforce-node';

  // dev mode - just change the pkg name
  //
  // this helps reduce the diff size when working on jsforce locally and
  // want to `npm link` it into your project using `@jsforce/jsforce-node`.
  if (dev) {
    await fs.writeFile('package.json', JSON.stringify(pjson));
    shelljs.exec('npx prettier --write package.json');
    return;
  }
  pjson.files = pjson.files.filter(filterBrowserFiles);

  // jsforce-node doesn't ship with CLI, install `jsforce` if you need it
  delete pjson.bin;
  delete pjson.browser;

  if (pjson.dependencies) {
    // browser deps (polyfills for ES features)
    delete pjson.dependencies['@babel/runtime'];
    delete pjson.dependencies['@babel/runtime-corejs3'];
    delete pjson.dependencies['core-js'];
    // CLI deps
    delete pjson.dependencies['commander'];
    delete pjson.dependencies['inquirer'];
    delete pjson.dependencies['open'];
  }

  await fs.writeFile('package.json', JSON.stringify(pjson));

  // delete CLI code before build (imports deleted deps)
  shelljs.rm('-rf', 'src/cli');
  shelljs.rm('-rf', 'src/schema');

  shelljs.exec('npx prettier --write package.json');

  console.log('Running `npm install`');
  shelljs.exec('npm install');
})();
