import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  extends: [eslint.configs.recommended, tseslint.configs.recommended],
  files: ["**/*.ts"],
  rules: {
    "no-unused-vars": ["warn"],
  },
});
