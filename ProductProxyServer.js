const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(
  "/v1/api/products",
  createProxyMiddleware({
    target: "http://44.203.171.98:8081", // AWS Microservice
    changeOrigin: true,
    pathRewrite: (path, req) => {
      let query = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
      return `/v1/api/products${query}`; // Ensure query params are forwarded
    },
    onProxyReq: (proxyReq, req) => {
      proxyReq.setHeader("Origin", "http://localhost:3000");
    },
  })
);

const PORT = 5001; // Ensure it's the correct port
app.listen(PORT, () => {
  console.log(`🚀 Product Proxy Server running at http://localhost:${PORT}`);
});
