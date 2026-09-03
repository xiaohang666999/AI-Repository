import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "demo-mode");

console.log("[demo] building standalone preview...");
execSync("npx vite build --config vite.demo.config.ts", { cwd: root, stdio: "inherit" });

const builtHtml = path.join(outDir, "index.html");
const finalHtml = builtHtml;
if (!existsSync(builtHtml)) {
  throw new Error(`Expected built html not found: ${builtHtml}`);
}

const html = readFileSync(builtHtml, "utf8");

// Find the bundled JS asset.
const scriptMatch = html.match(/<script[^>]*src=["'](\.\/[^"']+\.js)["'][^>]*>/);
if (!scriptMatch) throw new Error("Could not find built JS script tag");
const jsRelative = scriptMatch[1];
const jsFile = path.join(outDir, jsRelative.replace(/^\.\//, ""));
if (!existsSync(jsFile)) throw new Error(`Missing JS asset: ${jsFile}`);

let js = readFileSync(jsFile, "utf8");

// Vite normally uses `new URL("file", import.meta.url).href` for assets. That
// syntax is only valid inside an ES module. Convert it to a plain relative URL
// so the standalone page can run as a classic script from file:// too.
js = js.replace(
  /new URL\("([^"]+)",import\.meta\.url\)\.href/g,
  (_m, asset) => `"assets/${asset}"`
);

// Any remaining `import.meta` reference would be a parse error in a classic
// script. Replacing it with `{}` is safe for the exact occurrences Vite emits
// here (environment placeholders).
js = js.replace(/\bimport\.meta\b/g, "({})");

writeFileSync(jsFile, js, "utf8");

const patchedHtml = html.replace(
  /<script[^>]*src=["'](\.\/[^"']+\.js)["'][^>]*>\s*<\/script>/,
  '<script defer src="./assets/index-demo.js"></script>'
);

// Keep a stable JS filename (easier to reason about when opening the folder).
renameSync(jsFile, path.join(outDir, "assets", "index-demo.js"));

writeFileSync(finalHtml, patchedHtml, "utf8");

// Remove files copied from public/ that are not needed by the standalone demo.
for (const extra of ["hud.json", "keybinds.json", "panel.json", "preview.png", "thumb.png"]) {
  const extraPath = path.join(outDir, extra);
  if (existsSync(extraPath)) unlinkSync(extraPath);
}

// Copy bundled radar images used by the original LexoRadar component.
const radarSource = path.join(root, "demo-src", "radar-maps");
const radarDest = path.join(outDir, "assets", "radar-maps");
if (existsSync(radarSource)) {
  mkdirSync(radarDest, { recursive: true });
  for (const file of readdirSync(radarSource)) {
    if (file.endsWith(".png")) {
      copyFileSync(path.join(radarSource, file), path.join(radarDest, file));
    }
  }
}

writeFileSync(
  path.join(outDir, "README.txt"),
  [
    "CS2 HUD 本地预览",
    "========================",
    "",
    "这不是原来的 LHM 运行程序。这是一个独立的本地预览文件夹。",
    "",
    "使用方法：",
    "  直接双击 index.html 打开即可，无需安装依赖、无需启动 CS/LHM、无需后端。",
    "",
    "包含内容：",
    "  - 1920x1080 的 HUD 画布（根据窗口自动缩放）",
    "  - 原项目 src/HUD 组件、样式、动效，未重写 UI",
    "  - 内置模拟的 CS2 GSI 数据",
    "  - 场景切换（冻结期、进行中、下包、拆弹、回合结束、暂停、超时、赛间、结束）",
    "  - 地图/雷达切换",
    "  - Killfeed 击杀动效、信息框显隐",
    "",
    "修改原 UI 后想重新生成这个文件夹：",
    "  npm install",
    "  npm run demo:build",
    "然后重新打开 demo-mode/index.html。",
    "",
    "开发实时预览（HMR）：",
    "  npm run demo",
  ].join("\n"),
  "utf8"
);

console.log("[demo] ok ->", finalHtml);
console.log("[demo] open demo-mode/index.html directly, no install/server needed.");
