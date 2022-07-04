import * as fs from 'fs';
import * as path from 'path';
import ejs from 'ejs';

import type { Plugin } from 'vite';

export interface Configuration {
    ignorePath: RegExp[];
}

const defaultConfig = {
    ignorePath: [/^\.|node_modules/]
};

function fileDirectory(config: Configuration = defaultConfig): Plugin {
    const finalConfig = {
        ...defaultConfig,
        ...config
    };

    return {
        name: 'vite-plugin-file-directory',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const reqPath = path.join(process.cwd(), req.url!);

                if (fs.existsSync(reqPath) && fs.lstatSync(reqPath).isDirectory()) {
                    const data = fs.readdirSync(reqPath);

                    const fileData = data
                        .filter(filename => {
                            for (const ignorePath of finalConfig.ignorePath) {
                                if (ignorePath.test(filename)) {
                                    return false;
                                }
                            }
                            return true;
                        })
                        .map(filename => ({
                            filename,
                            path: req.url === '/' ? req.url + filename : `${req.url}/${filename}`
                        }));

                    const tplPath = path.resolve(__dirname, './tpl.ejs');

                    ejs.renderFile(
                        tplPath,
                        {
                            data: fileData
                        },
                        (err, str) => {
                            if (err) {
                                return next(err);
                            }
                            res.end(str);
                        }
                    );
                } else {
                    next();
                }
            });
        }
    };
}

export default fileDirectory;
