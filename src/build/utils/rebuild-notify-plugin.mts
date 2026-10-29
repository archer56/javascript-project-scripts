import { isProduction } from './is-production.mjs';
import type { PluginBuild } from 'esbuild';

export const rebuildNotifyPlugin = () => ({
  name: 'rebuild-notify',
  setup(build: PluginBuild) {
    if (isProduction()) {
      return;
    }

    build.onEnd((result) => {
      const numberOfErrors = result.errors.length;
      const pural = numberOfErrors !== 1;
      console.log(`Built with ${numberOfErrors} error${pural ? 's' : ''}`);
    });
  },
});
