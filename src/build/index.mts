import * as esbuild from 'esbuild';
import Path from 'path';
import { isProduction } from './utils/is-production.mts';
import { rebuildNotifyPlugin } from './utils/rebuild-notify-plugin.mts';
import { startServerPlugin } from './utils/server-plugin.mts';
import { htmlPlugin, type HtmlOptions } from './utils/html-plugin.mts';

import { lessLoader } from 'esbuild-plugin-less';

type BuildOptions = {
  platform: 'node' | 'browser';
  rootDir: string;
  entryFile: string;
  outDir: string;
  html?: HtmlOptions;
};

const build = async (options: BuildOptions) => {
  const entryPoint = Path.resolve(options.rootDir, options.entryFile);

  const platformPlugins =
    options.platform === 'node'
      ? [
          startServerPlugin({
            entryFile: options.entryFile,
            outDir: options.outDir,
          }),
        ]
      : [
          lessLoader(),
          htmlPlugin(options?.html ?? {}, {
            entryFile: options.entryFile,
            outDir: options.outDir,
          }),
        ];

  const ctx = await esbuild.context({
    platform: options.platform,
    entryPoints: [entryPoint],
    bundle: true,
    outdir: options.outDir,
    format: 'esm',
    target: 'node24',
    minify: isProduction(),
    sourcemap: !isProduction(),
    packages: options.platform === 'node' ? 'external' : 'bundle',
    plugins: [rebuildNotifyPlugin(), ...platformPlugins],
  });

  if (!isProduction()) {
    ctx.watch();

    console.log('Watching...');
  } else {
    await ctx.rebuild();
    process.exit();
  }
};

export { build };
