import { type HtmlOptions } from './utils/html-plugin.mts';
type BuildOptions = {
    platform: 'node' | 'browser';
    rootDir: string;
    entryFile: string;
    outDir: string;
    html?: HtmlOptions;
};
declare const build: (options: BuildOptions) => Promise<void>;
export { build };
