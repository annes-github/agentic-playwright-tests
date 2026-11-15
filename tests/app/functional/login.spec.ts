import { AppRoutes, Messages } from '../../../enums/app/app';
import { expect, test } from '../../../fixtures/pom/test-options';
import { appUrl } from '../../../helpers/app/url';
import { generateLoginCredentials } from '../../../test-data/factories/app/user.factory';

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

    test(
        'should show an error for an unknown user',
        { tag: '@regression' },
        async ({ loginPage, page }) => {
            const { username, password } = generateLoginCredentials();

            await test.step('WHEN user submits unknown credentials', async () => {
                await loginPage.login(username, password);
            });

            await test.step('THEN the credentials error is shown', async () => {
                await expect(loginPage.errorMessage).toHaveText(
                    Messages.LOGIN_INVALID_CREDENTIALS
                );
                await expect(page).toHaveURL(appUrl(AppRoutes.LOGIN));
            });
        }
    );
});
