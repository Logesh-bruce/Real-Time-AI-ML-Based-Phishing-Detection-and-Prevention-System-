import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;
const DETECTION_API_URL = process.env.DETECTION_API_URL || 'http://localhost:3001';

// API Key Middleware
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'testkey_smoke_test_12345') {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
  next();
});

app.use('/api/detect', createProxyMiddleware({ 
  target: DETECTION_API_URL, 
  changeOrigin: true,
  pathRewrite: { '^/api/detect': '/api/scan' }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
