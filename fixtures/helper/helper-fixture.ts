import { test as base } from '@playwright/test';

/**
 * Helper fixtures for important, recurring setup and teardown.
 *
 * None are needed yet: the app under test (Swag Labs) keeps its only mutable
 * state (the cart) in each test's own browser context, so there is nothing
 * to tear down between tests.
 *
 * HOW TO ADD A HELPER FIXTURE (see the `fixtures` skill):
 * 1. Add its type to `HelperFixtures` below.
 * 2. Implement it with the setup → `use()` → teardown pattern; teardown after
 *    `use()` runs even when the test fails.
 * 3. It is available in tests automatically (merged in `test-options.ts`).
 */
export type HelperFixtures = Record<never, never>;

export const test = base.extend<HelperFixtures>({});
