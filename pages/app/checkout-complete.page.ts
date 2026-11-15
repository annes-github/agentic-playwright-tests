import { Locator, Page } from '@playwright/test';
import { Messages } from '../../enums/app/app';

/**
 * Page Object for "Checkout: Complete!", shown after an order is placed.
 */
export class CheckoutCompletePage {
    constructor(private readonly page: Page) {}

    // ==================== Feedback Locators ====================

    get confirmationHeading(): Locator {
        return this.page.getByRole('heading', {
            name: Messages.ORDER_COMPLETE,
        });
    }

    // ==================== Locators ====================

    get backHomeButton(): Locator {
        return this.page.getByRole('button', { name: 'Back Home' });
    }

    // ==================== Actions ====================

    /**
     * Returns to the inventory page.
     *
     * @returns {Promise<void>} Resolves when the click has been performed.
     */
    async backHome(): Promise<void> {
        await this.backHomeButton.click();
    }
}
