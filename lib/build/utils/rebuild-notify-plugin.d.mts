import type { PluginBuild } from 'esbuild';
export declare const rebuildNotifyPlugin: () => {
    name: string;
    setup(build: PluginBuild): void;
};
