# JavaScript Project Scripts
Common Scripts and setup files across projects

## Compiler
App compiler tools using esbuild.

Create a file called `build/server.config.mjs` or whatever you want to call it.



### Package JSON
Ensure you add the script to start up.
```json
 "start:server": "NODE_ENV=development node ./build/server.config.mjs",
```

```js
import { build } from 'javascript-project-scripts/build';

build({
  platform: 'node',
  rootDir: './src/server',
  outDir: './dist/server',
  entryFile: './server.ts',
});
```


## ESLint
To use the eslint configuration create `eslint.config.mjs` in your root directory then add the following:

### Example
```js
import sharedConfig from 'javascript-project-scripts/eslint-config';

export default sharedConfig;
```

Secondly create `.prettierrc.cjs` in your root directory and add the following:

```js
  module.exports = require('javascript-project-scripts/prettierrc.js');
```

### Important Notes
- `NODE_ENV` must be **explicitly** set to production when building the production bundle.

## TypeScript
### ESlint
Ensure Babel language is set to `typescript`

### TS Config
Add the file `tsconfig.json` to the root directory and add the following.

Just changing the rootDir and outDir etc so it matches your app.
```json

{
  "extends": "javascript-project-scripts/tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist/"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": ["node_modules", "lib", "dist"]
}
```