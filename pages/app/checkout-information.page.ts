import { Locator, Page } from '@playwright/test';
import { AppRoutes } from '../../enums/app/app';
import type { CheckoutInfo } from '../../fixtures/api/schemas/app/checkoutSchema';

/**
 * Page Object for "Checkout: Your Information" (checkout step one).
 * The inputs have no <label>; their accessible names come from placeholders.
 */
export class CheckoutInformationPage {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    get firstNameInput(): Locator {
        return this.page.getByRole('textbox', { name: 'First Name' });
    }

    get lastNameInput(): Locator {
        return this.page.getByRole('textbox', { name: 'Last Name' });
    }

    get postalCodeInput(): Locator {
        return this.page.getByRole('textbox', { name: 'Zip/Postal Code' });
    }

    get continueButton(): Locator {
        return this.page.getByRole('button', { name: 'Continue' });
    }

    get cancelButton(): Locator {
        return this.page.getByRole('button', { name: 'Cancel' });
    }

    // ==================== Feedback Locators ====================

    get errorMessage(): Locator {
        return this.page.getByRole('alert');
    }

    // ==================== Actions ====================

    /**
     * Opens checkout step one using the configured APP_URL.
     *
     * @returns {Promise<void>} Resolves when navigation is complete.
     */
    async open(): Promise<void> {
        await this.page.goto(
            `${process.env.APP_URL!}${AppRoutes.CHECKOUT_STEP_ONE}`,
            { waitUntil: 'domcontentloaded' }
        );
    }

    /**
     * Fills the provided fields; a field left out of `info` stays blank.
     *
     * @param {Partial<CheckoutInfo>} info - The checkout fields to fill.
     * @returns {Promise<void>} Resolves when the fields are filled.
     */
    async fill(info: Partial<CheckoutInfo>): Promise<void> {
        if (info.firstName !== undefined) {
            await this.firstNameInput.fill(info.firstName);
        }
        if (info.lastName !== undefined) {
            await this.lastNameInput.fill(info.lastName);
        }
        if (info.postalCode !== undefined) {
            await this.postalCodeInput.fill(info.postalCode);
        }
    }

    /**
     * Fills the provided fields and clicks Continue.
     *
     * @param {Partial<CheckoutInfo>} info - The checkout fields to fill.
     * @returns {Promise<void>} Resolves when the form has been submitted.
     */
    async submit(info: Partial<CheckoutInfo>): Promise<void> {
        await this.fill(info);
        await this.continueButton.click();
    }
}
