import { type ConfigEnv, defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";
import { join, resolve } from "path";

const pathSrc = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
	const root = process.cwd();

	// 加载环境配置
	const ENV = loadEnv(mode, root);

	const { VITE_APP_TITLE } = ENV;

	return defineConfig({
		base: "/",
		server: { host: true },
		resolve: {
			alias: {
				"@/": `${pathSrc}/`,
				"~/": `${pathSrc}/`
			}
		},
		plugins: [
			vue(),
			createHtmlPlugin({ minify: true, inject: { data: { TITLE: VITE_APP_TITLE } } })
		],
		build: {
			outDir: join("./dist"),
			// 启动 / 禁用 CSS 代码拆分
			cssCodeSplit: true,
			// 构建后是否生成 soutrce map 文件
			sourcemap: false,
			// 默认情况下 若 outDir 在 root 目录下， 则 Vite 会在构建时清空该目录。
			emptyOutDir: true
		}
	});
};
