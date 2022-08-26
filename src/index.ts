import * as fs from 'fs';
import * as path from 'path';

import type { Plugin } from 'vite';

export interface Options {
    ignoreFile?: RegExp[];
}

function listFile({ ignoreFile = [] }: Options = {}): Plugin {
    const ignoreFileRegList = [/^\.|node_modules/, ...ignoreFile];

    return {
        name: 'vite-plugin-list-file',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const reqPath = path.join(process.cwd(), req.url!);

                if (fs.existsSync(reqPath) && fs.lstatSync(reqPath).isDirectory()) {
                    const data = fs.readdirSync(reqPath);

                    const fileData = data
                        .filter(filename => {
                            for (const p of ignoreFileRegList) {
                                if (p.test(filename)) {
                                    return false;
                                }
                            }
                            return true;
                        })
                        .map(filename => ({
                            filename,
                            path: req.url === '/' ? req.url + filename : `${req.url}/${filename}`
                        }));

                    res.end(generateHtml(fileData));
                } else {
                    next();
                }
            });
        }
    };
}
function generateHtml(
    data: {
        filename: string;
        path: string;
    }[]
) {
    return `<!DOCTYPE html>
              <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>目录</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                        }
                        ul {
                            padding: 0 20px;
                        }
                        li {
                            list-style: none;
                            text-align: center;
                            height: 50px;
                            line-height: 50px;
                            border-bottom: 1px dashed #000;
                        }
                        a,
                        a:visited,
                        a:hover {
                            display: block;
                            width: 100%;
                            height: 100%;
                            color: deepskyblue;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <ul>
                        <li><a href="..">..</a></li>
                        ${data
                            .map(item => `<li><a href="${item.path}">${item.filename}</a></li>`)
                            .join('')}
                    </ul>
                </body>
            </html>`;
}

export default listFile;
