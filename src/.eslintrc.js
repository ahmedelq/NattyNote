module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [`eslint:recommended`, `plugin:json/recommended`, `prettier`],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: `module`,
  },
  rules: {
    "prettier/prettier": `error`,
    quotes: [`error`, `backtick`],
  },
  plugins: [`prettier`],

  globals: {
    window: false,
    document: false,
    module: false,
    chrome: false,
  },
  ignorePatterns: [`./build`, `./dist`],
};
