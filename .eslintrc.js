module.exports = {
    env: {
      browser: true,
      es6: true
    },
    extends: [
      'standard'
    ],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module'
    },
    rules: {
      "semi": ["warn", "always"],
      "quotes": ["warn", "single"],
      "indent": ["off", "tab"],
      "no-console": "warn"
    }
  }
  