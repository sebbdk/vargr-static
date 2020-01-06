const Koa = require('koa');
const koaIp = require('koa-ip');
const koaBody = require('koa-body');

const { handleFileUpload } = require('./func');

function setupAdminServer(ipWhitelist, webroot, webrootData) {
    const app = new Koa();
    ipWhitelist && app.use(koaIp(ipWhitelist));
    app.use(koaBody({ multipart: true }));

    app.use(async (ctx) => {
        if(ctx.request.method === "POST") {
            const file = ctx.request.files.file;
            const toPath = ctx.request.url.substr(1);

            if (file) {
                await handleFileUpload(file, toPath, webroot, webrootData)
            }
        }

        ctx.body = 'Nothing here yet...';
    });

    return app;
}

module.exports = { setupAdminServer }