import { AppConfigSchema } from '@config';
import { z } from 'zod';

export type IEnvironment = z.infer<typeof AppConfigSchema>['env'];
