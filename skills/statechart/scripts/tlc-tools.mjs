import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

// TLC 的 v1.8.0 是滚动预发布，jar 会被重新上传，所以钉住最新的不可变
// 发布版。这些脚本读取 1.7.4 的输出，那个版本没有 trace spec。
export const TLC_TOOL =
  "github:tlaplus/tlaplus[asset_pattern=tla2tools.jar,checksum=sha256:936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88]@1.7.4";
export const JAVA_TOOL = "java@temurin-25";

const SET_TLC_VARS =
  "把 TLA2TOOLS 设为 tla2tools.jar 的路径，并把 JAVA 设为一个 java 二进制（Java 11 或更高）。";
const indent = (text) => text.replace(/^/gm, "  ");

export function findTlc() {
  const { TLA2TOOLS, JAVA } = process.env;
  for (const [name, file] of Object.entries({ JAVA, TLA2TOOLS }))
    if (file && !fs.existsSync(file)) throw new Error(`${name} 是 ${file}，该路径不存在。`);
  if (TLA2TOOLS) return { jar: TLA2TOOLS, java: JAVA || "java" };
  const command = (tools) =>
    `cd "$(mktemp -d)" && MISE_CEILING_PATHS="$PWD" mise install ${tools.map((t) => `'${t}'`).join(" ")}`;
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), "statechart-mise-"));
  const env = { ...process.env, MISE_CEILING_PATHS: empty };
  const run = (...args) => spawnSync("mise", args, { cwd: empty, env, encoding: "utf8" });
  const mise = (...args) => {
    const r = run(...args);
    if (r.error)
      throw new Error(
        `找不到 TLC。它通过 mise 安装，而 mise 无法启动：${r.error.message}。请安装 mise（https://mise.jdx.dev），或者${SET_TLC_VARS}`,
      );
    if (r.status === 0) return r.stdout.trim();
    const said = (r.stderr ?? "").trim();
    if (!said || /not installed|mise bin/.test(said)) return "";
    throw new Error(
      `找不到 TLC，因为 mise 失败了：\n${indent(said)}\n安装命令：${command(JAVA ? [TLC_TOOL] : [JAVA_TOOL, TLC_TOOL])}\n先解决这个问题，或者${SET_TLC_VARS}`,
    );
  };
  const resolve = () => {
    const home = mise("where", TLC_TOOL);
    const jar = home && path.join(home, "tla2tools.jar");
    const java = JAVA || mise("which", "java", "--tool", JAVA_TOOL);
    return { jar: jar && fs.existsSync(jar) ? jar : "", java };
  };
  try {
    const found = resolve();
    if (found.jar && found.java) return found;
    const tools = [!found.java && JAVA_TOOL, !found.jar && TLC_TOOL].filter(Boolean);
    const names = [!found.jar && "TLC", !found.java && "Java"].filter(Boolean);
    console.error(`正在用 mise 安装 ${names.join("和")}。这只会发生一次。`);
    const r = run("install", "--quiet", ...tools);
    const installed = resolve();
    if (installed.jar && installed.java) return installed;
    const said =
      `${r.stderr ?? ""}${r.stdout ?? ""}`.trim() ||
      `mise install 以 ${r.status} 退出，没有输出`;
    throw new Error(
      `找不到 TLC，而且 mise 无法安装它：\n${indent(said)}\n安装命令：${command(tools)}\n或者${SET_TLC_VARS}`,
    );
  } finally {
    fs.rmSync(empty, { recursive: true, force: true });
  }
}

export function cannotRunTlc({ java, jar }, r) {
  const said = `java exited ${r.status ?? r.signal}:\n${indent(`${r.stderr}${r.stdout}`.trim())}`;
  return `无法用 ${java} -cp ${jar} 运行 TLC：${r.error?.message ?? said}\n先解决这个问题，或者${SET_TLC_VARS}`;
}
