// update-env-ip.js
import fs from "fs";
import os from "os";
import path from "path";

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

const ip = getLocalIP();
if (!ip) {
  console.error("❌ Could not detect local IP address.");
  process.exit(1);
}

const envPath = path.resolve(process.cwd(), ".env");
let envContent = fs.readFileSync(envPath, "utf-8");

envContent = envContent.replace(
  /VITE_API_BASE=http:\/\/.*:3000/,
  `VITE_API_BASE=http://${ip}:3000`
);

fs.writeFileSync(envPath, envContent);
console.log(`✅ Updated .env with IP: ${ip}`);
console.log(`📦 VITE_API_BASE=http://${ip}:3000`);
