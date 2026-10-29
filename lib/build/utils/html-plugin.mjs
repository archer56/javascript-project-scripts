import fs from 'fs';
import Path from 'path';
export const htmlPlugin = (options, internalOptions) => ({
    name: 'html-plugin',
    setup(build) {
        build.onEnd((result) => {
            const numberOfErrors = result.errors.length;
            if (numberOfErrors > 0) {
                return;
            }
            const serverStaticFolder = options.serverStaticFolder ?? '';
            const entryPointJS = [serverStaticFolder, Path.parse(internalOptions.entryFile).name + '.js'].join('/');
            const entryPointCSS = [serverStaticFolder, Path.parse(internalOptions.entryFile).name + '.css'].join('/');
            const { title, rootElementId, pwaManifestPath } = options ?? {};
            const titleTag = title ? `<title>${title}</title>` : '';
            const rootElementIdTag = rootElementId ? `<div id="${rootElementId}"></div>` : '';
            const pwaManifestPathTag = pwaManifestPath ? `<link rel="manifest" href="${pwaManifestPath}"></link>` : '';
            const html = `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="apple-touch-icon" sizes="180x180" href="${serverStaticFolder}/apple-touch-icon.png">
            <link rel="icon" type="image/png" sizes="32x32" href="${serverStaticFolder}/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="16x16" href="${serverStaticFolder}/favicon-16x16.png">
            ${titleTag}
            ${pwaManifestPathTag}
          </head>
          <body>
            ${rootElementIdTag}
            <script type="module" src="${entryPointJS}"></script>
            <link rel="stylesheet" href="${entryPointCSS}">
          </body>
        </html>
      `;
            if (!fs.existsSync(internalOptions.outDir)) {
                fs.mkdirSync(internalOptions.outDir, { recursive: true }); // Create the directory if it doesn't exist
            }
            fs.writeFileSync(`${internalOptions.outDir}/index.html`, html);
        });
    },
});
