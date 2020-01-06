
const rmfr = require('rmfr');

const { setupAdminServer } = require('./admin.api')
const { setupPublicServe } = require('./public.api')
const { createPath, unpackBundles } = require('./func')

module.exports = async function({
    webroot = `${process.cwd()}/webroot`,
    webrootData = `${process.cwd()}/files`,
    bundles = {
        'archive': './archive.zip',
        'test/a' : './testdir',
        'test/e': '/Users/sebb/Desktop/e'
    },
    port = 3000,
    adminPort = 3001,
    enableIndexes = true,
    ipWhitelist = null,
    adminIpWhitelist = [ '::1' ],
    enableAdminAPI = true,
    fetchAdminGUI = true,
    CORSConfig = {}
} = {}) {
    await rmfr(webrootData); // remove, or make and option.
    await rmfr(webroot);

    await createPath(webroot);
    await createPath(webrootData);

    if (fetchAdminGUI === true) {
        // @TODO, Make admin gui.
        // @TODO, Add and configure admin gui to bundles list.
    }

    await unpackBundles(bundles, webrootData, webroot);

    const publicApp = setupPublicServe(webroot, ipWhitelist, enableIndexes);
    publicApp.listen(port);

    if (enableAdminAPI) {
        const adminApp = setupAdminServer(adminIpWhitelist, webroot, webrootData);
        adminApp.listen(adminPort);
    }
}

