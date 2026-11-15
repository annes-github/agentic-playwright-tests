import { z } from 'zod/v4';
import type { output as zOutput } from 'zod/v4';

/**
 * Schema for the login form payload. Swag Labs signs in with a username,
 * not an email address.
 */
export const LoginCredentialsSchema = z.strictObject({
    username: z.string().min(1),
    password: z.string().min(1),
});

// Type exports
export type LoginCredentials = zOutput<typeof LoginCredentialsSchema>;
