const { createProxyMiddleware } = require("http-proxy-middleware");

const host = process.env.REACT_APP_PROXY_HOST;
const port = process.env.REACT_APP_PROXY_PORT;

module.exports = function (app) {
  app.use(
    "/proxy",
    createProxyMiddleware({
      target: host + ":" + port,
      changeOrigin: true,
    })
  );
};
