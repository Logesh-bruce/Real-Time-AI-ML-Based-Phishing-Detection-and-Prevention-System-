import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { getDb } from "./db";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.use(express.json());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });

  // Initialize DB
  const db = await getDb();

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Detections API
  app.get("/api/v1/detections", async (req, res) => {
    try {
      const detections = db.prepare('SELECT * FROM detections ORDER BY timestamp DESC LIMIT 10').all();
      res.json({ detections });
    } catch (e) {
      res.status(500).json({ success: false, error: 'Database error' });
    }
  });

  // Post-Delivery Remediation API
  app.get("/api/v1/remediations", async (req, res) => {
    try {
      const remediations = db.prepare('SELECT * FROM remediations ORDER BY timestamp DESC LIMIT 10').all();
      res.json({ remediations });
    } catch (e) {
      res.status(500).json({ success: false, error: 'Database error' });
    }
  });

  app.get("/api/v1/audit_logs", async (req, res) => {
    try {
      const auditLogs = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10').all();
      res.json({ auditLogs });
    } catch (e) {
      res.status(500).json({ success: false, error: 'Database error' });
    }
  });

  app.post("/api/v1/remediation/quarantine", async (req, res) => {
    const { id, action } = req.body;

    try {
      db.prepare('UPDATE remediations SET status = ? WHERE id = ?').run('COMPLETED', id);
      db.prepare('INSERT INTO audit_logs (id, action, target, user, reason) VALUES (?, ?, ?, ?, ?)').run(
        `AUD-${Math.floor(Math.random() * 10000)}`, action, id, 'Admin User', 'Manual action via dashboard');

      io.emit('threat.remediated', {
        id,
        action,
        timestamp: new Date().toISOString(),
        status: 'COMPLETED'
      });
      res.json({ success: true, message: `Action ${action} applied to ${id}` });
    } catch (e) {
      res.status(500).json({ success: false, error: 'Database error' });
    }
  });

  // Cross-Channel Correlation API
  app.get("/api/v1/correlation/active", async (req, res) => {
    try {
      const correlations = db.prepare('SELECT * FROM correlations ORDER BY timestamp DESC LIMIT 10').all();
      res.json({
        correlations: correlations.length > 0 ? correlations : [
          {
            id: 'CORR-892',
            score: 98,
            channels: ['EMAIL', 'URL'],
            description: 'Coordinated credential harvesting targeting Finance',
            timestamp: new Date().toISOString()
          }
        ]
      });
    } catch (e) {
      res.status(500).json({ success: false, error: 'Database error' });
    }
  });

  // SIEM/SOAR Configuration API
  app.get("/api/v1/siem/configs", async (req, res) => {
    try {
      const configs = db.prepare('SELECT * FROM siem_configs').all();
      res.json({ configs });
    } catch (e) {
      res.status(500).json({ success: false, error: 'Database error' });
    }
  });

  app.post("/api/v1/siem/config", async (req, res) => {
    const { type, endpoint, token, enabled } = req.body;
    try {
      db.prepare(`
        INSERT INTO siem_configs (id, type, endpoint, token, enabled)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          endpoint=excluded.endpoint,
          token=excluded.token,
          enabled=excluded.enabled
      `).run(type, type, endpoint, token, enabled ? 1 : 0);
      res.json({ success: true, message: `SIEM configuration for ${type} saved.` });
    } catch (e) {
      res.status(500).json({ success: false, error: 'Database error' });
    }
  });

  // Claude-style Detection API
  app.post("/api/v1/detect", async (req, res) => {
    const { type, input, legitimate_domain } = req.body;

    // Simple mock logic for the new UI
    const lowerInput = (input || '').toLowerCase();
    const isPhishing = lowerInput.includes('login') || lowerInput.includes('verify') || lowerInput.includes('urgent') || lowerInput.includes('secure') || lowerInput.includes('password') || lowerInput.includes('account');

    let score = isPhishing ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 20) + 5;
    let risk_level = isPhishing ? (score > 90 ? 'critical' : 'high') : (score > 15 ? 'medium' : 'low');
    let confidence = isPhishing ? Math.floor(Math.random() * 10) + 90 : Math.floor(Math.random() * 10) + 90;

    let indicators: string[] = [];

    if (isPhishing) {
      if (type === 'url') {
        indicators = [
          "Suspicious keyword found in URL path",
          "Domain age is less than 30 days",
          "SSL certificate is self-signed or invalid",
          "URL structure matches known phishing kits"
        ];
      } else if (type === 'email') {
        indicators = [
          "Sender domain fails SPF/DKIM checks",
          "Urgent language detected in subject/body",
          "Contains suspicious links or attachments",
          "Reply-To address differs from From address"
        ];
      } else if (type === 'text') {
        indicators = [
          "Contains urgent call to action",
          "Requests sensitive information",
          "Includes suspicious shortened URL",
          "Matches known smishing patterns"
        ];
      }
    } else {
      if (type === 'url') {
        indicators = [
          "Domain has established reputation",
          "Valid SSL certificate from trusted authority",
          "No suspicious keywords detected"
        ];
      } else if (type === 'email') {
        indicators = [
          "Sender domain passes DMARC/SPF/DKIM",
          "No suspicious links or attachments",
          "Language analysis shows normal patterns"
        ];
      } else if (type === 'text') {
        indicators = [
          "No suspicious URLs detected",
          "Language analysis shows normal patterns"
        ];
      }
    }

    if (legitimate_domain && isPhishing) {
      indicators.push(`Input attempts to spoof legitimate domain: ${legitimate_domain}`);
    }

    setTimeout(() => {
      res.json({
        score: score / 100, // Normalize to 0-1 for the UI
        is_phishing: isPhishing,
        risk_level,
        indicators,
        confidence
      });
    }, 1500); // simulate network delay
  });

  // Threat Analysis API
  app.post("/api/v1/analyze", async (req, res) => {
    const { payload, type } = req.body;
    const isThreat = payload.toLowerCase().includes('login') || payload.toLowerCase().includes('verify') || payload.toLowerCase().includes('urgent');

    setTimeout(async () => {
      const verdict = isThreat ? 'THREAT CONFIRMED' : 'SAFE';
      const confidence = isThreat ? 98 : 99;

      if (isThreat) {
        const detId = `DET-${Math.floor(Math.random() * 10000)}`;
        try {
          db.prepare('INSERT INTO detections (id, type, target, confidence, status) VALUES (?, ?, ?, ?, ?)').run(
            detId, type || 'URL', payload, confidence, 'BLOCKED');

          io.emit('threat.detected', {
            id: detId,
            type: type || 'URL',
            target: payload,
            confidence,
            status: 'BLOCKED',
            time: new Date().toLocaleTimeString()
          });
        } catch (e) {
          console.error("Failed to save detection", e);
        }
      }

      res.json({
        verdict,
        confidence,
        scores: {
          nlp: isThreat ? 95 : 5,
          url: isThreat ? 99 : 2,
          visual: isThreat ? 88 : 1,
          dna: isThreat ? 92 : 0
        },
        iocs: isThreat ? [
          { type: 'DOMAIN', value: 'paypal-secure-login.tk', confidence: 99 },
          { type: 'IP', value: '192.168.1.50', confidence: 95 },
          { type: 'KEYWORD', value: 'urgent account verification', confidence: 88 }
        ] : [],
        rawJson: {
          timestamp: new Date().toISOString(),
          payload: payload,
          analysis_engine: "PhishGuard_ML_v2.1",
          verdict: isThreat ? "MALICIOUS" : "BENIGN",
          confidence_score: isThreat ? 0.98 : 0.99,
          extracted_features: {
            domain_age_days: isThreat ? 2 : 3450,
            ssl_valid: !isThreat,
            suspicious_keywords: isThreat ? ["login", "verify", "urgent"] : []
          }
        }
      });
    }, 1500); // Simulate processing time
  });

  // WebSocket connections
  io.on('connection', (socket) => {
    console.log('Client connected to WebSocket:', socket.id);

    // Simulate real-time events
    const interval = setInterval(async () => {
      // Randomly emit events to test real-time functionality
      const rand = Math.random();
      if (rand > 0.8) {
        const detId = `DET-${Math.floor(Math.random() * 10000)}`;
        const type = ['URL', 'EMAIL', 'SMS'][Math.floor(Math.random() * 3)];
        const target = 'suspicious-domain.com';
        const confidence = Math.floor(Math.random() * 20) + 80;
        const status = 'BLOCKED';

        try {
          db.prepare('INSERT INTO detections (id, type, target, confidence, status) VALUES (?, ?, ?, ?, ?)').run(
            detId, type, target, confidence, status);
        } catch (e) {}

        socket.emit('threat.detected', {
          id: detId,
          type,
          target,
          confidence,
          status,
          time: new Date().toLocaleTimeString()
        });
      } else if (rand > 0.6 && rand <= 0.8) {
        const corrId = `CORR-${Math.floor(Math.random() * 1000)}`;
        const score = Math.floor(Math.random() * 20) + 80;

        try {
          db.prepare('INSERT INTO correlations (id, score, status) VALUES (?, ?, ?)').run(
            corrId, score, 'ACTIVE');
        } catch (e) {}

        socket.emit('correlation.new', {
          id: corrId,
          score,
          channels: ['EMAIL', 'URL', 'SMS'].sort(() => 0.5 - Math.random()).slice(0, 2),
          description: 'New coordinated attack detected',
          timestamp: new Date().toISOString()
        });
      }
    }, 5000);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      clearInterval(interval);
    });
  });

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`PhishGuard backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
