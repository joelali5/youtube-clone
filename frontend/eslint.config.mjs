// eslint.config.mjs
import next from '@next/eslint-plugin-next';
import js from '@eslint/js';

export default [
  {
    // Applies Next.js-specific rules
    plugins: {
      '@next/next': next
    },
    rules: {
      ...next.configs.recommended.rules,
      // Add your custom rules here
    }
  },
  {
    // Applies standard ESLint rules
    ...js.configs.recommended,
    rules: {
      // Additional global rules
    }
  }
];
















// import { dirname } from 'path';
// import { fileURLToPath } from 'url';
// import { FlatCompat } from '@eslint/eslintrc';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [...compat.extends('next/core-web-vitals')];

// export default eslintConfig;
