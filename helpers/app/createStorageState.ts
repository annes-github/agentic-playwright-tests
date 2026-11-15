import { chromium } from '@playwright/test';
import { StorageStatePaths } from '../../enums/app/app';
import { LoginPage } from '../../pages/app/login.page';

/**
 * Signs in through the login page and saves the browser storage state, so
 * UI tests in the `chromium` project start signed in.
 *
 * @returns {Promise<void>} Resolves when the storage state is saved.
 *
 * @example
 * ```ts
 * // In auth.setup.ts
 * test('setup authentication', async () => {
 *   await createAppStorageState();
 * });
 * ```
 */
export async function createAppStorageState(): Promise<void> {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.loginAndVerify(
        process.env.APP_EMAIL!,
        process.env.APP_PASSWORD!
    );

    await context.storageState({ path: StorageStatePaths.APP });
    await browser.close();
}
