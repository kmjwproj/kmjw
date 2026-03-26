import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
  ]),
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      'react-hooks/exhaustive-deps': 'warn',
      'react/self-closing-comp': 'warn',
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' },
      ],

      'no-console': ['warn', { allow: ['error', 'warn'] }],
      '@typescript-eslint/no-empty-function': 'warn',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // 테스트에선 any 허용
      '@typescript-eslint/no-non-null-assertion': 'off', // 테스트에선 ! 연산자 허용
      '@typescript-eslint/no-empty-function': 'off', // Mock 함수용 빈 함수 허용
      'no-console': 'off', // 테스트 중 로그 확인 허용
    },
  },
  prettierConfig,
]);

export default eslintConfig;
