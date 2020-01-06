const koaStatic = require('koa-static');
const koaIp = require('koa-ip');
const Koa = require('koa');
const fs = require('fs');

function setupPublicServe(webroot, ipWhitelist, enableIndexes = true) {
    const app = new Koa();
    ipWhitelist && app.use(koaIp(ipWhitelist))

    app.use(koaStatic(webroot));

    if (enableIndexes) {
        app.use(async (ctx, next) => {
            const path = webroot + ctx.request.url;
            const files = await new Promise(resolve => {
                fs.stat(path, (err, stat) => {
                    if (stat.isDirectory()) {
                        fs.readdir(path, (err, files) => {
                            resolve(files.map(f => f));
                        });
                    } else {
                        resolve(null);
                    }
                });
            });

            ctx.set('Content-Type', 'application/json');
            ctx.body = JSON.stringify({ files });
            await next();
        });
    }

    return app;
}

module.exports = { setupPublicServe }