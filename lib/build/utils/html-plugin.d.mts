import type { PluginBuild } from 'esbuild';
export type HtmlOptions = {
    title?: string;
    serverStaticFolder?: string;
    rootElementId?: string;
    pwaManifestPath?: string;
};
export type InternalOptions = {
    outDir: string;
    entryFile: string;
};
export declare const htmlPlugin: (options: HtmlOptions, internalOptions: InternalOptions) => {
    name: string;
    setup(build: PluginBuild): void;
};
