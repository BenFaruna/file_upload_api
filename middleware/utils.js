module.exports = (req, res, next) => {
    const URL = req.baseUrl + req.url;
    const start = Date.now()
    next();
    console.log(`${req.method} - ${URL} ${Date.now() - start} ms`);
}
