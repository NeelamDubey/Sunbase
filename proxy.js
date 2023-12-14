// proxy.js
import express from 'express';
import httpProxy from 'http-proxy';
import cors from 'cors';

const app = express();
const proxy = httpProxy.createProxyServer();
app.use(cors());

app.use('/', (req, res) => {
  proxy.web(req, res, { target: targetURL });
});
const targetURL = 'https://qa2.sunbasedata.com'; // Replace with the URL you want to proxy to

app.use('/', (req, res) => {
  proxy.web(req, res, { target: targetURL });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
