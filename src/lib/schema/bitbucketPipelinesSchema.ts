import { z } from 'zod';

// allowed in `step`
export const scriptSchema = z.union([
  z.string(),
  z.object({
    pipe: z.string(),
    variables: z.record(z.string(), z.unknown()).optional(),
  }),
]);

export type Script = z.infer<typeof scriptSchema>;

// allowed in `step` and `service` or "root"
export const imageSchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    username: z.string().optional(),
    password: z.string().optional(),
    aws: z.unknown().optional(),
    'run-as-user': z.union([z.string(), z.number()]).optional(),
  }),
]);

export type Image = z.infer<typeof imageSchema>;

export const cloudRuntimeSchema = z.object({
  'atlassian-ip-ranges': z.boolean().optional().default(false),
  arch: z.enum(['arm', 'x86']).optional().default('x86'),
});

// allowed in `step` or `options`
export const runtimeSchema = z.object({
  cloud: cloudRuntimeSchema,
});

export type Runtime = z.infer<typeof runtimeSchema>;

// allowed in `step`
export const artifactSchema = z.union([
  // Simple array of paths format
  z.array(z.string()),
  // Object format with download and paths
  z.object({
    download: z.boolean().optional().default(true),
    paths: z.array(z.string()).optional(),
  }),
]);

export type Artifact = z.infer<typeof artifactSchema>;

// allowed in `step` or `stage`
export const conditionSchema = z.object({
  condition: z.object({
    changesets: z.object({
      includePaths: z.array(z.string()),
    }),
  }),
});

export type Condition = z.infer<typeof conditionSchema>;

// allowed in `step`
export const cloneSchema = z.object({
  depth: z
    .union([z.number().int().positive(), z.literal('full')])
    .optional()
    .default(50),
  enabled: z.boolean().optional().default(true),
  lfs: z.boolean().optional().default(false),
  'skip-ssl-verify': z.boolean().optional().default(false),
});

export type Clone = z.infer<typeof cloneSchema>;

export const maxTimeSchema = z
  .number()
  .int()
  .min(1)
  .max(720)
  .optional()
  .default(120);

export const sizeSchema = z.enum(['1x', '2x', '4x', '8x', '16x']).optional();

// Step schema
export const stepSchema = z.object({
  // basic values
  name: z.string(),
  'max-time': maxTimeSchema,
  size: sizeSchema,
  oidc: z.boolean().optional(),
  trigger: z.enum(['automatic', 'manual']).optional(),
  'fail-fast': z.boolean().optional(),
  'on-fail': z
    .object({
      strategy: z.enum(['ignore', 'fail']),
    })
    .optional(),

  // based on defined services
  services: z.array(z.string()).optional(),
  'runs-on': z.array(z.string()).optional(),
  // based on predefined and custom defined caches
  caches: z.array(z.string()).optional(),
  // based on configured deployments
  deployment: z.string().optional(),

  // custom nodes
  script: z.array(scriptSchema), // required
  'after-script': z.array(scriptSchema).optional(),
  image: imageSchema.optional(),
  runtime: runtimeSchema.optional(),
  artifacts: artifactSchema.optional(),
  condition: conditionSchema.optional(),
  clone: cloneSchema.optional(),
});

export type Step = z.infer<typeof stepSchema>;

// Pipeline step schema
export const pipelineStepSchema = z.object({
  step: stepSchema,
});

export type PipelineStep = z.infer<typeof pipelineStepSchema>;

// ----

// Allowed parent properties — default, branches, pull-requests, tags, and custom
export const parallelStepsSchema = z.object({
  parallel: z.object({
    steps: z.array(pipelineStepSchema),
    'fail-fast': z.boolean().optional(),
  }),
});

export type ParallelSteps = z.infer<typeof parallelStepsSchema>;

// Allowed parent properties — default, branches, pull-requests, tags, and custom
export const stageSchema = z.object({
  name: z.string().optional(),
  steps: z.array(pipelineStepSchema),
  deployment: z.string().optional(),
  trigger: z.enum(['automatic', 'manual']).optional(),
  condition: conditionSchema.optional(),
});

export type Stage = z.infer<typeof stageSchema>;

export const pipelineStageSchema = z.object({
  stage: z.array(pipelineStepSchema),
});

export type PipelineStage = z.infer<typeof pipelineStageSchema>;

// Variable schema
export const variablesSchema = z.object({
  variables: z.array(
    z.object({
      name: z.string(),
      default: z.string().optional(),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'allowed-values': z.array(z.string()).optional(),
    }),
  ),
});

export type Variables = z.infer<typeof variablesSchema>;

export const importSchema = z.object({
  import: z.string(),
});

export type Import = z.infer<typeof importSchema>;

export const pipelineSchema = z
  .array(
    z.union([pipelineStepSchema, pipelineStageSchema, parallelStepsSchema]),
  )
  .or(
    z.strictObject({
      import: z.string(),
    }),
  )
  .optional();

export type Pipeline = z.infer<typeof pipelineSchema>;

// Service schema
export const serviceSchema = z.object({
  image: imageSchema,
  memory: z.number().int().min(128).max(8192).optional().default(1024),
  type: z.enum(['docker']).optional(),
  variables: z.record(z.string(), z.unknown()).optional(),
});

export type Service = z.infer<typeof serviceSchema>;

// Cache schema
export const cacheSchema = z.union([
  // Simple string format for path
  z.string(),
  // Object format with key and path
  z.object({
    key: z
      .object({
        files: z.array(z.string()), // Files to monitor for changes, supports glob patterns
      })
      .optional(),
    path: z.string(), // Path to be cached, supports glob patterns
  }),
]);

export type Cache = z.infer<typeof cacheSchema>;

// Main configuration schema
export const bitbucketPipelineSchema = z
  .object({
    options: z
      .object({
        'max-time': maxTimeSchema,
        docker: z.boolean().optional().default(false),
        size: sizeSchema,
        runtime: runtimeSchema.optional(),
      })
      .passthrough()
      .default({}),

    definitions: z
      .object({
        services: z.record(z.string(), serviceSchema).optional(),
        caches: z.record(z.string(), cacheSchema).default({}),
        scripts: z.record(z.string(), scriptSchema).optional(),
        steps: z.record(z.string(), stepSchema).optional(),
      })
      .passthrough()
      .default({}),

    pipelines: z
      .object({
        default: pipelineSchema,
        branches: z.record(z.string(), pipelineSchema).default({}),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'pull-requests': z.record(z.string(), pipelineSchema).default({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          '**': [],
        }),
        tags: z.record(z.string(), pipelineSchema).default({}),
        custom: z
          .record(
            z.string(),
            z.array(
              z.union([
                pipelineStepSchema,
                pipelineStageSchema,
                parallelStepsSchema,
                // this only exists in custom
                variablesSchema,
              ]),
            ),
          )
          .default({}),
      })
      .passthrough()
      .default({}),
  })
  .passthrough()
  .default({ pipelines: {} });

export type BitbucketPipeline = z.infer<typeof bitbucketPipelineSchema>;
