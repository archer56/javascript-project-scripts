import type { ChildProcess } from 'child_process';
import { spawn } from 'child_process';
import { isProduction } from './is-production.mts';
import Path from 'path';
import type { PluginBuild } from 'esbuild';

let serverProcess: ChildProcess | null = null;

const stopServer = () => {
  if (serverProcess) serverProcess.kill();
};

type StartServerOptions = {
  outDir: string;
  entryFile: string;
};

const startServer = (options: StartServerOptions) => {
  stopServer();

  const entryPoint = Path.resolve(options.outDir, Path.parse(options.entryFile).name + '.js');

  serverProcess = spawn('node', [entryPoint], { stdio: 'inherit' });

  serverProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Server process exited with code ${code}`);
    }
  });
};

type StartServerPluginOptions = {
  outDir: string;
  entryFile: string;
};

export const startServerPlugin = (options: StartServerPluginOptions) => ({
  name: 'start-server',
  setup(build: PluginBuild) {
    if (isProduction()) {
      return;
    }

    build.onEnd((result) => {
      stopServer();

      if (result.errors.length === 0) {
        startServer({
          outDir: options.outDir,
          entryFile: options.entryFile,
        });
      }
    });
  },
});
