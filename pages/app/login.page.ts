import { expect, Locator, Page } from '@playwright/test';
import { AppRoutes } from '../../enums/app/app';

/**
 * Page Object for the Swag Labs login page.
 * The inputs have no <label>; their accessible names come from placeholders,
 * so `getByRole('textbox', { name })` is the top-priority locator.
 */
export class LoginPage {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    get usernameInput(): Locator {
        return this.page.getByRole('textbox', { name: 'Username' });
    }

    get passwordInput(): Locator {
        return this.page.getByRole('textbox', { name: 'Password' });
    }

    get loginButton(): Locator {
        return this.page.getByRole('button', { name: 'Login' });
    }

    // ==================== Feedback Locators ====================

    get errorMessage(): Locator {
        return this.page.getByRole('alert');
    }

    get dismissErrorButton(): Locator {
        return this.page.getByRole('button', { name: 'Dismiss error' });
    }

    // ==================== Actions ====================

    /**
     * Opens the login page using the configured APP_URL.
     *
     * @returns {Promise<void>} Resolves when navigation is complete.
     */
    async open(): Promise<void> {
        await this.page.goto(`${process.env.APP_URL!}${AppRoutes.LOGIN}`, {
            waitUntil: 'domcontentloaded',
        });
    }

    /**
     * Fills the credentials and submits the login form. Does not wait for
     * navigation: a rejected login stays on the page with an error alert.
     *
     * @param {string} username - The account username.
     * @param {string} password - The account password.
     * @returns {Promise<void>} Resolves when the form has been submitted.
     */
    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    /**
     * Logs in and verifies the inventory page is reached.
     *
     * @param {string} username - The account username.
     * @param {string} password - The account password.
     * @returns {Promise<void>} Resolves when the inventory URL is confirmed.
     */
    async loginAndVerify(username: string, password: string): Promise<void> {
        await this.login(username, password);
        await expect(this.page).toHaveURL(
            `${process.env.APP_URL!}${AppRoutes.INVENTORY}`
        );
    }
}
