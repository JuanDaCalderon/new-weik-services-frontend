module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json', './tsconfig.node.json'],
		tsconfigRootDir: __dirname,
	},
	plugins: ['react', '@typescript-eslint/eslint-plugin'],
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:react/jsx-runtime',
		'plugin:prettier/recommended',
	],
	rules: {
		"no-unused-vars": "off",
		'react/no-unescaped-entities': 'off',
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^_",
				"caughtErrorsIgnorePattern": "^_"
			}
		],
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'prettier/prettier': ['error',
			{
				printWidth: 100,
				tabWidth: 2,
				semi: true,
				singleQuote: true,
				trailingComma: 'none',
				bracketSpacing: false,
				bracketSameLine: true,
				jsxBracketSameLine: true,
				proseWrap: 'always',
				useTabs: false,
				endOfLine: 'auto'
			}
		],
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			node: {
				paths: ['src'],
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
};
