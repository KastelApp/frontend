import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactCompiler from "eslint-plugin-react-compiler";
import preferArrow from "eslint-plugin-prefer-arrow";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			"react-compiler": reactCompiler,
			"prefer-arrow": preferArrow,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
			quotes: [
				"error",
				"double",
				{
					avoidEscape: true,
				},
			],
			"object-curly-spacing": ["error", "always"],
			"react-hooks/exhaustive-deps": "off",
			"prefer-arrow/prefer-arrow-functions": "error",
			"react-refresh/only-export-components": "off",
			camelcase: "error",
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "variable",
					types: ["function"],
					format: ["camelCase", "PascalCase"],
				},
				{
					selector: "variable",
					format: ["camelCase"],
				},
			],
			"react/no-unescaped-entities": "off",
			"react/display-name": "off",
			"@typescript-eslint/no-unsafe-declaration-merging": "off", // who actually uses this rule???
			"react-compiler/react-compiler": "error",
		},
	},
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
);
