import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser } },
  pluginReact.configs.flat.recommended,
  {
    "extends": "react-app",
    "rules": {
      "no-unused-vars": [
        "warn",
        { "vars": "all", "args": "after-used", "ignoreRestSiblings": false, "varsIgnorePattern": "^_|^import$" }
      ]
    }
  }
]);
