import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CORS_ORIGINS || '*' }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const NLP_URL = process.env.NLP_SERVICE_URL || 'http://localhost:8001';
const URL_URL = process.env.URL_SERVICE_URL || 'http://localhost:8002';

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'detection-api' });
});

app.post('/api/scan', async (req, res) => {
  const { url, text } = req.body;
  
  try {
    let urlResult = null;
    let textResult = null;
    
    if (url) {
      try {
        const response = await axios.post(`${URL_URL}/analyze/url`, { url });
        urlResult = response.data;
      } catch (e) {
        console.error("URL Service unavailable");
      }
    }
    
    if (text) {
      try {
        const response = await axios.post(`${NLP_URL}/analyze/text`, { text });
        textResult = response.data;
      } catch (e) {
        console.error("NLP Service unavailable");
      }
    }
    
    const result = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      urlResult,
      textResult,
      isThreat: (urlResult?.isThreat || textResult?.isThreat) || false,
      overallConfidence: Math.max(urlResult?.confidence || 0, textResult?.confidence || 0)
    };
    
    // Emit to real-time dashboard
    io.emit('new_scan', result);
    
    res.json(result);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected to real-time feed');
});

httpServer.listen(PORT, () => {
  console.log(`Detection API running on port ${PORT}`);
});
