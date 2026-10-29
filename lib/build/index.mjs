import * as esbuild from 'esbuild';
import Path from 'path';
import { isProduction } from "./utils/is-production.mjs";
import { rebuildNotifyPlugin } from "./utils/rebuild-notify-plugin.mjs";
import { startServerPlugin } from "./utils/server-plugin.mjs";
import { htmlPlugin } from "./utils/html-plugin.mjs";
import { lessLoader } from 'esbuild-plugin-less';
const build = async (options) => {
    const entryPoint = Path.resolve(options.rootDir, options.entryFile);
    const platformPlugins = options.platform === 'node'
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
    }
    else {
        await ctx.rebuild();
        process.exit();
    }
};
export { build };
