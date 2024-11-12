//@ts-check
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "tinyexec";

const cwd = fileURLToPath(new URL("./.outputs", import.meta.url));
fs.rmSync(cwd, { force: true, recursive: true });

await Promise.all([run("one"), run("two"), run("three")]);

async function run(dir) {
	const project = path.resolve(cwd, dir);
	fs.mkdirSync(project, { recursive: true });
	try {
		// create project
		const sv =
			"pnpm dlx sv@latest create . --template minimal --types ts --no-add-ons --no-install";
		const [svCmd, ...svArgs] = sv.split(" ");
		await exec(svCmd, svArgs, { nodeOptions: { stdio: "pipe", cwd: project } });

		// run storybook init
		const storybook =
			"pnpm dlx storybook@latest init --skip-install --no-dev --package-manager pnpm";
		const [sbCmd, ...sbArgs] = storybook.split(" ");
		await exec(sbCmd, sbArgs, {
			nodeOptions: {
				cwd: project,
				stdio: "inherit",
			},
			throwOnError: true,
		});
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
}
