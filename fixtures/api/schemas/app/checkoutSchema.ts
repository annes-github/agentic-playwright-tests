import { z } from 'zod/v4';
import type { output as zOutput } from 'zod/v4';

/**
 * Schema for the "Checkout: Your Information" form payload.
 * All three fields are required by the app's client-side validation.
 */
export const CheckoutInfoSchema = z.strictObject({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    postalCode: z.string().min(1),
});

// Type exports
export type CheckoutInfo = zOutput<typeof CheckoutInfoSchema>;
