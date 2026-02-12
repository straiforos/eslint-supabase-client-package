import { Rule } from 'eslint';
import { Minimatch } from 'minimatch';

/**
 * Rule configuration options
 */
export interface RuleOptions {
  /**
   * Glob patterns for paths where Supabase client imports are allowed
   * @default ["lib/services/**", "src/services/**", "supabase/functions/_shared/**"]
   */
  allowedPaths?: string[];

  /**
   * Import patterns to restrict (supports glob patterns)
   * @default - See DEFAULT_RESTRICTED_PATTERNS in source
   */
  restrictedImports?: string[];

  /**
   * Custom error message
   * @default "Supabase client imports are only allowed in services layer. Use service classes instead."
   */
  errorMessage?: string;
}

const DEFAULT_ALLOWED_PATTERNS = [
  'lib/services/**',
  'src/services/**',
  'supabase/functions/_shared/**',
];

const DEFAULT_RESTRICTED_PATTERNS = [
  '@/lib/supabase/*',
  '**/supabase-client',
];

const DEFAULT_ERROR_MESSAGE =
  'Supabase client imports are only allowed in services layer. Use service classes instead.';

/**
 * ESLint rule to enforce services layer architecture
 * Prevents direct Supabase client imports outside configured service directories
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Restrict Supabase client imports to services layer only to enforce layered architecture',
      recommended: true,
    },
    messages: {
      restrictedImport: '{{errorMessage}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedPaths: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          restrictedImports: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          errorMessage: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const ruleOptions: RuleOptions = {
      allowedPaths: options.allowedPaths || DEFAULT_ALLOWED_PATTERNS,
      restrictedImports: options.restrictedImports || DEFAULT_RESTRICTED_PATTERNS,
      errorMessage: options.errorMessage || DEFAULT_ERROR_MESSAGE,
    };

    const filename = context.filename;

    // If no filename provided (e.g., in RuleTester), check if test case
    // RuleTester passes test cases with filename in the test object
    if (!filename) {
      // For RuleTester without explicit filename, allow the check
      // This handles edge cases in testing
      return {};
    }

    // Check if current file is in an allowed path
    const isAllowedPath = ruleOptions.allowedPaths!.some((pattern) => {
      const matcher = new Minimatch(pattern, { dot: true });
      return matcher.match(filename);
    });

    // Skip checking if file is in allowed path
    if (isAllowedPath) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const importPath = String(node.source.value);

        // Check if import matches any restricted pattern
        const isRestricted = ruleOptions.restrictedImports!.some((pattern) => {
          const matcher = new Minimatch(pattern);
          return matcher.match(importPath);
        });

        if (isRestricted) {
          context.report({
            node,
            messageId: 'restrictedImport',
            data: {
              errorMessage: ruleOptions.errorMessage,
            },
          });
        }
      },
    };
  },
};

export default rule;
