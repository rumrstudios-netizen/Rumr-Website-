/**
 * Extracts the embedded base64 GLB from Hero3D.jsx and saves it
 * as public/camera.glb so the component can load it as a URL.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const heroPath = join(__dirname, "../src/components/Hero3D.jsx");
const outPath  = join(__dirname, "../public/camera.glb");

console.log("Reading Hero3D.jsx …");
const src = readFileSync(heroPath, "utf8");

// Find the backtick-delimited base64 string
const start = src.indexOf("`\n") + 2;          // first char after opening backtick+newline
const end   = src.indexOf("\n`;", start);       // position of closing \n`;
if (start < 2 || end < 0) {
  console.error("Could not locate the embedded GLB string. Aborting.");
  process.exit(1);
}

const b64 = src.slice(start, end).replace(/\s/g, ""); // strip all whitespace
console.log(`Extracted ${b64.length} base64 chars → ~${Math.round(b64.length * 0.75 / 1024)} KB binary`);

const buf = Buffer.from(b64, "base64");
writeFileSync(outPath, buf);
console.log(`✅  Saved to public/camera.glb (${buf.length} bytes)`);
