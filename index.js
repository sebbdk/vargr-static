const args = process.argv.reduce((acc, curr) => {
    if(curr.indexOf('=') > -1) {
        const [key, val] = curr.split('=');
        acc[key] = val;
    }

    return acc;
}, {});

try {
    const bundles = args['bundles'] ? JSON.parse(args['bundles']):{};
    require('./lib/static.api')({ ...args, bundles });
} catch(err) {
    console.error("Error in main method", err);
}