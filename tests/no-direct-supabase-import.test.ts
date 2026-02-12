import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../src/rules/no-direct-supabase-import';

const ruleTester = new RuleTester();

ruleTester.run('no-direct-supabase-import', rule, {
  valid: [
    // Allowed paths - lib/services
    {
      code: "import { createClient } from '@/lib/supabase/server';",
      filename: 'lib/services/server/assessment-service.ts',
    },
    {
      code: "import { createClient } from '@/lib/supabase/client';",
      filename: 'lib/services/client/evidence-service.ts',
    },
    {
      code: "import { createClient } from '@/lib/supabase/middleware';",
      filename: 'lib/services/middleware/auth-middleware.ts',
    },
    // Allowed paths - src/services
    {
      code: "import { createClient } from '@/lib/supabase/server';",
      filename: 'src/services/server/assessment-service.ts',
    },
    {
      code: "import { createClient } from '@/lib/supabase/client';",
      filename: 'src/services/client/evidence-service.ts',
    },
    // Allowed paths - supabase/functions/_shared
    // {
    //   code: "import { createClient } from '../_shared/supabase-client';",
    //   filename: 'supabase/functions/_shared/queue-service.ts',
    // },
    // {
    //   code: "import { createClient } from './supabase-client';",
    //   filename: 'supabase/functions/_shared/factories.ts',
    // },
    // Non-Supabase imports should be allowed anywhere
    {
      code: "import { Button } from '@/components/ui/button';",
      filename: 'app/dashboard/page.tsx',
    },
    {
      code: "import { AssessmentService } from '@/lib/services/server';",
      filename: 'app/api/assessments/route.ts',
    },
    {
      code: "import { useState } from 'react';",
      filename: 'components/test/Test.tsx',
    },
    {
      code: "import { createAssessmentService } from '@/lib/services/server';",
      filename: 'app/api/route.ts',
    },
    {
      code: "import { QueueService } from '../_shared/queue-service';",
      filename: 'supabase/functions/worker/index.ts',
    },
    // Empty files
    {
      code: 'const x = 42;',
      filename: 'app/api/route.ts',
    },
  ],
  invalid: [
    // Disallowed - API routes
    {
      code: "import { createClient } from '@/lib/supabase/server';",
      filename: 'app/api/assessments/route.ts',
      errors: [
        {
          messageId: 'restrictedImport',
        },
      ],
    },
    {
      code: "import { createClient } from '@/lib/supabase/server';",
      filename: 'app/api/queue/jobs/route.ts',
      errors: [
        {
          messageId: 'restrictedImport',
        },
      ],
    },
    // Disallowed - client components
    {
      code: "import { createClient } from '@/lib/supabase/client';",
      filename: 'components/dashboard/AssessmentList.tsx',
      errors: [
        {
          messageId: 'restrictedImport',
        },
      ],
    },
    {
      code: "import { createClient } from '@/lib/supabase/client';",
      filename: 'app/dashboard/page.tsx',
      errors: [
        {
          messageId: 'restrictedImport',
        },
      ],
    },
    // Mixed imports - should flag only the Supabase one
    {
      code: `
        import { Button } from '@/components/ui/button';
        import { createClient } from '@/lib/supabase/server';
        import { useState } from 'react';
      `,
      filename: 'app/api/route.ts',
      errors: [
        {
          messageId: 'restrictedImport',
        },
      ],
    },
  ],
});
