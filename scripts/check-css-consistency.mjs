import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(root, "..");

function parseRootTokens(css) {
  const match = css.match(/:root\s*\{([^}]+)\}/);
  if (!match) {
    return null;
  }

  const tokens = {};
  for (const line of match[1].split("\n")) {
    const tokenMatch = line.match(/(--[\w-]+)\s*:\s*(.+?)\s*;/);
    if (tokenMatch) {
      tokens[tokenMatch[1]] = tokenMatch[2];
    }
  }
  return tokens;
}

function parseHtmlFontSize(css) {
  const match = css.match(/html\s*\{[^}]*font-size:\s*([^;]+);/);
  return match ? match[1].trim() : null;
}

const canonicalTokensPath = path.join(root, "src", "tokens.css");
const canonicalBasePath = path.join(root, "src", "base.css");
const brandCssPath = path.join(workspaceRoot, "kvshvl", "assets", "css", "main.css");

const canonicalTokens = parseRootTokens(readFileSync(canonicalTokensPath, "utf8"));
const brandTokens = parseRootTokens(readFileSync(brandCssPath, "utf8"));
const canonicalHtml = parseHtmlFontSize(readFileSync(canonicalBasePath, "utf8"));
const brandHtml = parseHtmlFontSize(readFileSync(brandCssPath, "utf8"));

const errors = [];

for (const [name, value] of Object.entries(canonicalTokens)) {
  if (brandTokens[name] !== value) {
    errors.push(`kvshvl missing or mismatched ${name}: expected "${value}", got "${brandTokens[name] ?? "missing"}"`);
  }
}

if (canonicalHtml !== brandHtml) {
  errors.push(
    `html font-size mismatch: platform-design-system has "${canonicalHtml}", kvshvl has "${brandHtml}"`,
  );
}

const authLayout = readFileSync(path.join(workspaceRoot, "auth", "src", "app", "layout.tsx"), "utf8");
const cydMain = readFileSync(
  path.join(workspaceRoot, "checkyourdrawings", "frontend", "src", "main.tsx"),
  "utf8",
);

if (!authLayout.includes('import "./globals.css"')) {
  errors.push("auth must import ./globals.css (platform CSS entry point)");
}

if (!readFileSync(path.join(workspaceRoot, "auth", "src", "app", "globals.css"), "utf8").includes("@kvshvl/platform-design-system")) {
  errors.push("auth globals.css must import @kvshvl/platform-design-system tokens and base");
}

for (const [label, source] of [
  ["checkyourdrawings", cydMain],
  ["auth globals.css", readFileSync(path.join(workspaceRoot, "auth", "src", "app", "globals.css"), "utf8")],
]) {
  if (!source.includes("@kvshvl/platform-design-system/tokens.css")) {
    errors.push(`${label} must import @kvshvl/platform-design-system/tokens.css`);
  }
  if (!source.includes("@kvshvl/platform-design-system/base.css")) {
    errors.push(`${label} must import @kvshvl/platform-design-system/base.css`);
  }
}

if (errors.length > 0) {
  console.error("CSS consistency check failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("CSS consistency check passed.");
console.log(`- Canonical tokens: ${Object.keys(canonicalTokens).length} variables`);
console.log(`- Brand site tokens aligned`);
console.log(`- auth and checkyourdrawings import platform-design-system`);
