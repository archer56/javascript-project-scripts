import { spawn } from 'child_process';
import { isProduction } from "./is-production.mjs";
import Path from 'path';
let serverProcess = null;
const stopServer = () => {
    if (serverProcess)
        serverProcess.kill();
};
const startServer = (options) => {
    stopServer();
    const entryPoint = Path.resolve(options.outDir, Path.parse(options.entryFile).name + '.js');
    serverProcess = spawn('node', [entryPoint], { stdio: 'inherit' });
    serverProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`Server process exited with code ${code}`);
        }
    });
};
export const startServerPlugin = (options) => ({
    name: 'start-server',
    setup(build) {
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
