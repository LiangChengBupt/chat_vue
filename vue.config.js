let proxyObj = {};
proxyObj['/ws'] = {
  ws: true,
  // target: "ws://43.143.173.140:8082"
  target: "ws://localhost:8082"
};
proxyObj['/'] = {
  ws: false,
  target: 'http://localhost:8082',
  // target: 'http://43.143.173.140:8082',
  changeOrigin: true,
  pathRewrite: {
    '^/': ''
  }
}
module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: proxyObj
 }
}