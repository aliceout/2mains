import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

// eslint-config-next ≥16 exporte directement des configs flat — plus
// besoin de FlatCompat / @eslint/eslintrc.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    // Migrations générées par `payload migrate:create` : signature imposée
    // ({ db, payload, req }) même quand tout n'est pas utilisé.
    files: ['src/migrations/**'],
    rules: { '@typescript-eslint/no-unused-vars': 'off' },
  },
  globalIgnores(['.next/', 'src/payload-types.ts', 'src/payload-generated-schema.ts']),
])
