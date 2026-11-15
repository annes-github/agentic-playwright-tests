# Spec patterns

Paths assume `tests/{area}/<type>/`; run `ls tests/` for the real area. The live instances are `tests/app/functional/login.spec.ts`, `tests/app/functional/checkout-information.spec.ts` (data-driven), `tests/app/e2e/purchase.spec.ts` and `tests/app/auth.setup.ts`. API specs follow `api-testing`.

## Functional

One behaviour per test. The `chromium` project starts signed in through the storage state; `resetStorageState()` clears cookies, permissions and the app's web storage so the test starts signed out (a login page, a form that pre-fills the user's data).

```typescript
import { AppRoutes } from '../../../enums/app/app';
import { expect, test } from '../../../fixtures/pom/test-options';
import { appUrl } from '../../../helpers/app/url';

test.describe('login', () => {
    test.beforeEach(async ({ resetStorageState, loginPage }) => {
        await resetStorageState();
        await loginPage.open();
    });

    test(
        'should log in with valid credentials',
        { tag: '@smoke' },
        async ({ loginPage, page }) => {
            await test.step('WHEN user submits valid credentials', async () => {
                await loginPage.login(
                    process.env.APP_EMAIL!,
                    process.env.APP_PASSWORD!
                );
            });

            await test.step('THEN user lands on the inventory page', async () => {
                await expect(page).toHaveURL(appUrl(AppRoutes.INVENTORY));
            });
        }
    );
});
```

## Data-driven

The loop sits inside `describe` and outside `test()`, so each row is its own test. Rows come from a static `.ts` file (`data-strategy`), or an inline array when only this spec needs them. Each row pairs an input with the `Messages` member it must produce, as `tests/app/functional/checkout-information.spec.ts` does.

```typescript
const REQUIRED_FIELDS: ReadonlyArray<{
    field: keyof CheckoutInfo;
    message: Messages;
}> = [
    { field: 'firstName', message: Messages.FIRST_NAME_REQUIRED },
    { field: 'lastName', message: Messages.LAST_NAME_REQUIRED },
];

for (const { field, message } of REQUIRED_FIELDS) {
    test(
        `should show an error when ${field} is blank`,
        { tag: '@regression' },
        async ({ checkoutInformationPage }) => {
            const { [field]: _blank, ...info } = generateCheckoutInfo();
            await checkoutInformationPage.submit(info);
            await expect(checkoutInformationPage.errorMessage).toHaveText(
                message
            );
        }
    );
}
```

## E2E

One test for the whole journey, chained with steps. The `chromium` project loads the storage state from setup, so the test starts signed in. The live instance is `tests/app/e2e/purchase.spec.ts`.

```typescript
import { expect, test } from '../../../fixtures/pom/test-options';

test.describe('e2e purchase', () => {
    test.beforeEach(async ({ inventoryPage }) => {
        await inventoryPage.open();
    });

    test(
        'should buy a product through to confirmation',
        { tag: '@e2e' },
        async ({ inventoryPage, cartPage, checkoutCompletePage }) => {
            await test.step('GIVEN user adds a product to the cart', async () => {
                // chain page-object actions here
            });

            await test.step('WHEN user checks out', async () => {
                await inventoryPage.header.openCart();
                await cartPage.checkout();
                // fill details, finish
            });

            await test.step('THEN the order confirmation is shown', async () => {
                await expect(
                    checkoutCompletePage.confirmationHeading
                ).toBeVisible();
            });
        }
    );
});
```

## Setup

`tests/{area}/*.setup.ts` runs in the `setup-ui` project before `chromium` (`playwright.config.ts`). No tag. It writes the browser storage state through the helpers in `helpers/{area}/`:

```typescript
import * as fs from 'node:fs';
import { expect, test } from '../../fixtures/pom/test-options';
import { StorageStatePaths } from '../../enums/app/app';
import { createAppStorageState } from '../../helpers/app/createStorageState';

test('setup authentication - browser storage state', async () => {
    await createAppStorageState();
    expect(fs.existsSync(StorageStatePaths.APP)).toBe(true);
});
```
