//@ts-check
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const cwd = fileURLToPath(new URL("./.outputs", import.meta.url));
fs.rmSync(cwd, { force: true, recursive: true });
fs.mkdirSync(cwd, { recursive: true });

try {
	execSync(
		"pnpm dlx sv@latest create . --template minimal --types ts --no-add-ons --no-install",
		{ stdio: "pipe", cwd }
	);
	execSync("pnpm dlx storybook@latest init --skip-install --no-dev", {
		cwd,
		stdio: "inherit",
		encoding: "utf8",
	});
} catch (e) {
	console.error(e);
}
