# eslint-plugin-supabase-services-layer

ESLint plugin to enforce services layer architecture pattern in Supabase projects by restricting direct Supabase client imports to configured service directories.

## Why This Plugin?

In Supabase projects using Next.js (or other frameworks), it's a best practice to encapsulate database access and business logic in a services layer. This plugin enforces that pattern by preventing direct imports of Supabase clients outside of designated service directories.

**Benefits:**
- Centralized business logic
- Easier testing and mocking
- Consistent error handling
- Clear separation of concerns
- Better code organization

## Installation

```bash
npm install eslint-plugin-supabase-services-layer --save-dev
# or
pnpm add -D eslint-plugin-supabase-services-layer
# or
yarn add -D eslint-plugin-supabase-services-layer
```

## Configuration

Add the plugin to your ESLint configuration:

### Flat Config (eslint.config.js)

```javascript
import supabaseServicesLayer from 'eslint-plugin-supabase-services-layer';

export default [
  {
    plugins: {
      'supabase-services-layer': supabaseServicesLayer,
    },
    rules: {
      'supabase-services-layer/no-direct-supabase-import': [
        'error',
        {
          allowedPaths: ['lib/services/**', 'supabase/functions/_shared/**'],
          restrictedImports: ['@/lib/supabase/*', '**/supabase-client'],
        },
      ],
    },
  },
];
```

### Legacy Config (.eslintrc.js)

```javascript
module.exports = {
  plugins: ['supabase-services-layer'],
  rules: {
    'supabase-services-layer/no-direct-supabase-import': [
      'error',
      {
        allowedPaths: ['lib/services/**', 'supabase/functions/_shared/**'],
        restrictedImports: ['@/lib/supabase/*', '**/supabase-client'],
      },
    ],
  },
};
```

## Rule Options

### `allowedPaths` (array of glob patterns)

Default: `['lib/services/**', 'src/services/**', 'supabase/functions/_shared/**']`

Glob patterns for directories where Supabase client imports are allowed.

**Examples:**
```javascript
allowedPaths: [
  'lib/services/**',      // Allow in lib/services/ and subdirectories
  'src/db/**',           // Allow in src/db/ and subdirectories
  'supabase/functions/_shared/**',  // Allow edge function services
]
```

### `restrictedImports` (array of glob patterns)

Default: `['@/lib/supabase/*', '**/supabase-client']`

Import patterns to restrict. Supports glob patterns.

**Examples:**
```javascript
restrictedImports: [
  '@/lib/supabase/*',      // Restricts @/lib/supabase/server, client, middleware
  '**/supabase-client',     // Restricts relative imports to supabase-client files
  '@supabase/supabase-js', // Restricts direct @supabase/supabase-js imports
]
```

### `errorMessage` (string)

Default: `"Supabase client imports are only allowed in services layer. Use service classes instead."`

Custom error message to display when violations are found.

## Examples

### ❌ Incorrect - Direct Import in API Route

```typescript
// app/api/assessments/route.ts
import { createClient } from '@/lib/supabase/server'; // ❌ ESLint Error

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.from('assessments').select('*');
  return Response.json(data);
}
```

### ✅ Correct - Using Service Factory

```typescript
// app/api/assessments/route.ts
import { createAssessmentService } from '@/lib/services/server'; // ✅ OK

export async function GET() {
  const assessmentService = await createAssessmentService();
  const assessments = await assessmentService.listAssessments();
  return Response.json(assessments);
}
```

### ❌ Incorrect - Direct Import in Edge Function

```typescript
// supabase/functions/worker/index.ts
import { createClient } from '../_shared/supabase-client'; // ❌ ESLint Error

Deno.serve(async (req) => {
  const supabase = createClient();
  const { data } = await supabase.from('queue').select('*');
  // ...
});
```

### ✅ Correct - Using Edge Function Service

```typescript
// supabase/functions/worker/index.ts
import { QueueService } from '../_shared/queue-service'; // ✅ OK

Deno.serve(async (req) => {
  const queueService = new QueueService(this.supabaseFactory);
  const jobs = await queueService.getPendingJobs();
  // ...
});
```

### ✅ Allowed - Import in Service File

```typescript
// lib/services/server/assessment-service.ts
import { createClient } from '@/lib/supabase/server'; // ✅ OK - in allowed path

export async function createAssessmentService() {
  const supabase = await createClient();
  return {
    async listAssessments() {
      const { data } = await supabase.from('assessments').select('*');
      return data;
    },
  };
}
```

## Common Project Structures

### Next.js with App Router

```javascript
// eslint.config.js
export default [
  {
    rules: {
      'supabase-services-layer/no-direct-supabase-import': [
        'error',
        {
          allowedPaths: [
            'lib/services/**',
            'supabase/functions/_shared/**',
          ],
          restrictedImports: [
            '@/lib/supabase/*',
            '**/supabase-client',
          ],
        },
      ],
    },
  },
];
```

### Monorepo with Multiple Packages

```javascript
// eslint.config.js
export default [
  {
    rules: {
      'supabase-services-layer/no-direct-supabase-import': [
        'error',
        {
          allowedPaths: [
            'packages/api/src/services/**',
            'packages/shared/src/db/**',
          ],
          restrictedImports: [
            '@my-org/supabase/*',
            '~/lib/supabase/*',
          ],
        },
      ],
    },
  },
];
```

### Custom Services Directory

```javascript
// eslint.config.js
export default [
  {
    rules: {
      'supabase-services-layer/no-direct-supabase-import': [
        'error',
        {
          allowedPaths: ['src/data-access/**', 'src/api/services/**'],
          restrictedImports: ['~/supabase-clients/*'],
        },
      ],
    },
  },
];
```

## Troubleshooting

### False Positives in Allowed Paths

If you're getting errors in files that should be allowed:

1. Check your glob patterns match the file path
2. Use `**` to match subdirectories: `lib/services/**`
3. Verify the path separator matches your OS (use `/` for cross-platform)

```javascript
// ❌ Wrong - won't match subdirectories
allowedPaths: ['lib/services']

// ✅ Correct - matches all subdirectories
allowedPaths: ['lib/services/**']
```

### Need to Temporarily Disable

If you need to temporarily allow a violation (not recommended):

```typescript
// eslint-disable-next-line supabase-services-layer/no-direct-supabase-import
import { createClient } from '@/lib/supabase/server';
```

Better approach: Create a service method instead!

### Pattern Not Matching

If your custom patterns aren't working:

1. Ensure patterns use forward slashes: `src/services/**`
2. Use `*` for single-level matching: `*.ts`
3. Use `**` for multi-level matching: `lib/**`
4. Test patterns with [minimatch](https://github.com/isaacs/minimatch#testing)

## Migration Guide

If you're adding this plugin to an existing codebase:

1. Install the plugin
2. Run ESLint to find all violations
3. Create service classes for common operations
4. Refactor code to use services
5. Re-run ESLint to verify

**Common refactoring patterns:**

- API Routes → Use factory functions from `lib/services/server`
- Edge Functions → Use service classes with `ISupabaseClientFactory`
- Components → Use client services from `lib/services/client`

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Related

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [ESLint Plugin Documentation](https://eslint.org/docs/latest/extend/plugins)
