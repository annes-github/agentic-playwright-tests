import { Locator, Page } from '@playwright/test';

/**
 * Component Object for the Swag Labs primary header, shown on every
 * signed-in page.
 */
export class HeaderComponent {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    // Accessible name tracks the cart size: "Cart, empty" / "Cart, 2 items".
    get cartButton(): Locator {
        return this.page.getByRole('button', { name: /^Cart,/ });
    }

    get cartBadge(): Locator {
        return this.page.getByTestId('shopping-cart-badge');
    }

    // ==================== Actions ====================

    /**
     * Opens the cart via the header cart button.
     *
     * @returns {Promise<void>} Resolves when the click has been performed.
     */
    async openCart(): Promise<void> {
        await this.cartButton.click();
    }
}
