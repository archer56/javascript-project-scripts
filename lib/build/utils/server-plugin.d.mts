import type { PluginBuild } from 'esbuild';
type StartServerPluginOptions = {
    outDir: string;
    entryFile: string;
};
export declare const startServerPlugin: (options: StartServerPluginOptions) => {
    name: string;
    setup(build: PluginBuild): void;
};
export {};
