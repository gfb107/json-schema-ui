module.exports = {
  "extends": [
    "eslint:recommended",
    "idiomatic"
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "one-var": "off"
  },
  "globals": {
    "document": false,
    "Element": false,
    "Node": false
  }
};
