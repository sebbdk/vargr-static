const unzip = require("unzipper");
const fs = require('fs');
const path = require('path');

function pathExists(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stat) => {
            err === null
                ? resolve(true)
                : resolve(false);
        });
    })
}

async function createPath(path) {
    return new Promise(async (resolve, reject) => {
        const exists = await pathExists(path);

        if(!exists) {
            fs.mkdir(path, { recursive: true }, err => {
                err && reject(`Error while making dir, ${path}, ${err}`);
                resolve();
            });
        } else {
            resolve();
        }
    });
}

async function symlink(fromPath, toPath) {
    let parentPath = toPath;
    parentPath = parentPath.split('/');
    parentPath.pop();
    parentPath = `${parentPath.join('/')}`;

    try {
        await createPath(parentPath);
    } catch(err) {
        throw `Error while trying to symlink ${fromPath}, ${toPath}: ${err}`
    }

    if(await pathExists(toPath)) {
        await rmfr(toPath);
    }

    return new Promise((resolve, reject) => {
        fs.symlink(path.resolve(fromPath), toPath, (err) => {
            (err && reject(err)) || resolve();
        });
    });
}

async function unzipWithPromise(zipPath, outputPath) {
    return new Promise((resolve, reject) => {
        const writer = fs.createReadStream(zipPath).pipe(unzip.Extract({ path: outputPath }))

        writer.on('error', (err) => {
            reject(err);
        });

        writer.on('finish', async () => {
            resolve();
        });
    })
}

async function handlZipFile({ bundlePath, servePath, webrootDataPath, webrootPath }) {
    const zipDataPath = `${webrootDataPath}/${servePath}`;

    try {
        await unzipWithPromise(bundlePath, zipDataPath);
        await symlink(zipDataPath, `${webrootPath}/${servePath}`);
    } catch(err) {
        throw `Error while handling zipfile: ${err}`;
    }
}

async function handleDir({ bundlePath, servePath, webrootPath }) {
    await symlink(bundlePath, `${webrootPath}/${servePath}`);
}

async function unpackBundle(bundlePath, servePath, webrootDataPath, webrootPath) {
    if (bundlePath.split('.').pop() == 'zip') {
        await handlZipFile({bundlePath, servePath, webrootDataPath, webrootPath})
    } else {
        await handleDir({bundlePath, servePath, webrootDataPath, webrootPath});
    }
}

async function unpackBundles(bundles, webrootDataPath, webrootPath) {
    return Promise.all(Object.keys(bundles).map(k => unpackBundle(bundles[k], k, webrootDataPath, webrootPath)));
}

async function handleFileUpload(file, toPath, webrootPath, webrootDataPath) {
    const dataPath = `${webrootDataPath}/${toPath}/${file.name}`;

    if(await pathExists(dataPath)) {
        await rmfr(dataPath);
    }

    await createPath(`${webrootDataPath}/${toPath}`);

    if (file.name.split('.').pop() == 'zip') {
        await handlZipFile({
            bundlePath: file.path,
            servePath: toPath,
            webrootDataPath,
            webrootPath
        });
    }

    await (new Promise((resolve, reject) => {
        const writer = fs.createReadStream(file.path).pipe(fs.createWriteStream(dataPath));

        writer.on('error', (err) => reject(err));
        writer.on('finish', () => resolve());
    }));
}

module.exports = {
    pathExists,
    createPath,
    symlink,
    unzipWithPromise,
    handlZipFile,
    handleDir,
    unpackBundle,
    unpackBundles,
    handleFileUpload
}