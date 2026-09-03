const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let incidents = [
  {
    id: 1,
    title: "Demo website is slow",
    severity: "P2",
    status: "Open"
  }
];

app.get("/", (req, res) => {
  res.json({ message: "OpsDesk Incident API is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", service: "opsdesk-api" });
});

app.get("/ready", (req, res) => {
  res.status(200).json({ status: "ready", service: "opsdesk-api" });
});

app.get("/api/incidents", (req, res) => {
  res.json(incidents);
});

app.post("/api/incidents", (req, res) => {
  const { title, severity = "P3" } = req.body;

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const incident = {
    id: incidents.length + 1,
    title,
    severity,
    status: "Open"
  };

  incidents.push(incident);
  res.status(201).json(incident);
});

app.listen(port, () => {
  console.log(`OpsDesk API is running on port ${port}`);
});