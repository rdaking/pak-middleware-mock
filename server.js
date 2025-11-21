const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const app = express();

// 1. Serve Swagger UI static
app.use("/docs", express.static(path.join(__dirname, "swagger-ui")));

// 2. Serve openapi.yaml
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "openapi.yaml"));
});

// 3. Start Prism mock server
const prism = spawn(
  "npx",
  [
    "prism",
    "mock",
    "openapi.yaml",
    "--port",
    "4010",
    "--host",
    "0.0.0.0",
    "--cors"
  ],
  { stdio: "inherit" }
);

// 4. Root redirect to Swagger UI
app.get("/", (req, res) => {
  res.redirect("/docs");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Swagger UI running on port ${PORT}`));
