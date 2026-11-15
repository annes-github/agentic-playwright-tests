import { test as base } from '@playwright/test';
import { CartPage } from '../../pages/app/cart.page';
import { CheckoutCompletePage } from '../../pages/app/checkout-complete.page';
import { CheckoutInformationPage } from '../../pages/app/checkout-information.page';
import { CheckoutOverviewPage } from '../../pages/app/checkout-overview.page';
import { InventoryPage } from '../../pages/app/inventory.page';
import { LoginPage } from '../../pages/app/login.page';

/**
 * Framework fixtures for page objects.
 * Add new page object types here as you create them.
 */
export type FrameworkFixtures = {
    /** Login page */
    loginPage: LoginPage;
    /** Inventory ("Products") page */
    inventoryPage: InventoryPage;
    /** "Your Cart" page */
    cartPage: CartPage;
    /** Checkout step one: "Your Information" */
    checkoutInformationPage: CheckoutInformationPage;
    /** Checkout step two: "Overview" */
    checkoutOverviewPage: CheckoutOverviewPage;
    /** Checkout confirmation page */
    checkoutCompletePage: CheckoutCompletePage;
    /** Clears cookies, permissions and the app's web storage so the test starts signed out */
    resetStorageState: () => Promise<void>;
};

/**
 * Extended test with page object fixtures.
 * Import `test` from `fixtures/pom/test-options.ts` in spec files, not from here.
 */
export const test = base.extend<FrameworkFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    checkoutInformationPage: async ({ page }, use) => {
        await use(new CheckoutInformationPage(page));
    },

    checkoutOverviewPage: async ({ page }, use) => {
        await use(new CheckoutOverviewPage(page));
    },

    checkoutCompletePage: async ({ page }, use) => {
        await use(new CheckoutCompletePage(page));
    },

    resetStorageState: async ({ context, page }, use) => {
        await use(async () => {
            await context.clearCookies();
            await context.clearPermissions();
            // Web storage is per origin: the page must be on the app before
            // localStorage (where this app keeps the cart) can be cleared.
            await page.goto(process.env.APP_URL!, {
                waitUntil: 'domcontentloaded',
            });
            await page.evaluate(() => {
                window.localStorage.clear();
                window.sessionStorage.clear();
            });
        });
    },
});
