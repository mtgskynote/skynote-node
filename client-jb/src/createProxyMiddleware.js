//import dot env package
import dotenv from "dotenv";
// import express
import express from "express";
// import http-proxy-middleware
import { createProxyMiddleware } from "http-proxy-middleware";

// config file for env
dotenv.config();

// access process variable
const proxyPort = process.env.PROXY_PORT_TO_NODE_BACKEND || 5000;

module.exports = function (app) {
  app.use(
    "/api/v1",
    createProxyMiddleware({
      target: `http://127.0.0.1:${proxyPort}`,
      changeOrigin: true,
    })
  );
};
