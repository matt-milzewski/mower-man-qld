const { readFileSync, existsSync, readdirSync } = require("node:fs");
const { join } = require("node:path");

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((file) => file.endsWith(".html"));
const required = ["index.html", "services.html", "gallery.html", "about.html", "contact.html", "404.html", "robots.txt", "sitemap.xml"];
const failures = [];

for (const file of required) {
  if (!existsSync(join(root, file))) {
    failures.push(`Missing ${file}`);
  }
}

for (const file of htmlFiles) {
  const html = readFileSync(join(root, file), "utf8");
  if (!html.includes("<title>")) failures.push(`${file} is missing a title`);
  if (!html.includes('name="description"')) failures.push(`${file} is missing a meta description`);
  if (!html.includes('rel="canonical"')) failures.push(`${file} is missing a canonical link`);
  if (!html.includes("/style.css")) failures.push(`${file} does not load style.css`);
  if (!html.includes("/scripts.js")) failures.push(`${file} does not load scripts.js`);
}

for (const asset of ["images/hero-lawn.webp", "images/og-hero.jpg", "images/favicon-mower.png"]) {
  if (!existsSync(join(root, asset))) failures.push(`Missing ${asset}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files and core assets.`);
