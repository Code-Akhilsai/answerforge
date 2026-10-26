#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Creating Express backend...");

const source = path.join(__dirname, "..");
const destination = path.join(process.cwd(), "backend");

if (fs.existsSync(destination)) {
  console.log("A backend folder already exists.");
  process.exit(1);
}

fs.cpSync(source, destination, {
  recursive: true,
});

console.log("Express backend created successfully!");
console.log("Run: cd backend");
