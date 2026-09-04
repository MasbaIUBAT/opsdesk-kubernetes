require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing. Check your .env file.");
}

app.use(express.json());
app.use(express.static("public"));

const incidentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      default: "P3"
    },
    status: {
      type: String,
      default: "Open"
    }
  },
  {
    timestamps: true
  }
);

const Incident = mongoose.model("Incident", incidentSchema);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", service: "opsdesk-api" });
});

app.get("/ready", (req, res) => {
  const isDatabaseReady = mongoose.connection.readyState === 1;

  if (!isDatabaseReady) {
    return res.status(503).json({
      status: "not ready",
      service: "opsdesk-api",
      database: "disconnected"
    });
  }

  res.status(200).json({
    status: "ready",
    service: "opsdesk-api",
    database: "connected"
  });
});

app.get("/api/incidents", async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: 1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: "Unable to load incidents" });
  }
});

app.post("/api/incidents", async (req, res) => {
  try {
    const { title, severity = "P3" } = req.body;

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const incident = await Incident.create({
      id: randomUUID(),
      title,
      severity,
      status: "Open"
    });

    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ error: "Unable to create incident" });
  }
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "opsdesk"
    });

    const incidentCount = await Incident.countDocuments();

    if (incidentCount === 0) {
      await Incident.create({
        id: "demo-incident-1",
        title: "Demo website is slow",
        severity: "P2",
        status: "Open"
      });
    }

    app.listen(port, () => {
      console.log(`OpsDesk API is running on port ${port}`);
      console.log("MongoDB connected");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();