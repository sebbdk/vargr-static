try {
    require('./lib/static.api')()
} catch(err) {
    console.error("Error in main method", err);
}
