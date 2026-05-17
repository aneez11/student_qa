const fs = require("fs");
const path = require("path");

const dist = path.join(process.cwd(), "dist");
const out = path.join(dist, "version.json");
const version = process.env.BUILD_VERSION || new Date().toISOString();

try {
  fs.mkdirSync(dist, { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ version }, null, 2));
  console.log("Wrote version file:", out, version);
} catch (err) {
  console.error("Failed to write version file:", err);
  process.exit(1);
}
