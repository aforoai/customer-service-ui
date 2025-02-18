const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

// ✅ Forward ALL "/v1/api/*" requests to the correct backend
app.use(
  "/v1/api",
  createProxyMiddleware({
    target: "http://44.203.171.98:8082", // Backend API
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Preserve the full API path and query params
      return path;
    },
    onProxyReq: (proxyReq, req) => {
      proxyReq.setHeader("Content-Type", "application/json");
      proxyReq.setHeader("Origin", "http://localhost:3000");
    },
  })
);

// ✅ Start Proxy Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Subscription Proxy Server running at http://localhost:${PORT}`);
});
