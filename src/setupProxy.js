const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware(['/energystore'], {
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: {'^/energystore' : '/'},
            headers: {
                Connection: "keep-alive"
            },
        })
    );
    app.use(
        createProxyMiddleware(['/cash'], {
            target: 'http://localhost:9095',
            changeOrigin: true,
            pathRewrite: {'^/cash' : ''},
        })
    );
    app.use(
        createProxyMiddleware( ['/api'], {
            target: 'http://localhost:9080',
            pathRewrite: {'^/api' : ''},
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware( ['/filestore'], {
            target: 'http://localhost:5000',
            pathRewrite: {'^/filestore' : '/'},
            changeOrigin: true,
        })
    );
    // app.use(
    //     '/subscription',
    //     createProxyMiddleware({
    //         target: 'http://localhost:6080',
    //         changeOrigin: true,
    //     })
    // );
};