import noDirectSupabaseImport from './rules/no-direct-supabase-import.js';

/**
 * ESLint plugin to enforce services layer architecture in Supabase projects
 */
const plugin = {
  meta: {
    name: 'eslint-plugin-supabase-services-layer',
    version: '1.0.0',
  },
  rules: {
    'no-direct-supabase-import': noDirectSupabaseImport,
  },
  configs: {
    recommended: {
      plugins: ['supabase-services-layer'],
      rules: {
        'supabase-services-layer/no-direct-supabase-import': 'error',
      },
    },
  },
};

export default plugin;

// Export types for TypeScript users
export type { RuleOptions } from './rules/no-direct-supabase-import.js';
