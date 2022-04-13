module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    es2017: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "max-len": ["error", {"code": 150}],
    "require-jsdoc": 0,
    "valid-jsdoc": 0,
  },
};
