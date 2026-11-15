import { Locator, Page } from '@playwright/test';
import { AppRoutes } from '../../enums/app/app';
import { HeaderComponent } from '../components/header.component';
import { ProductListComponent } from '../components/product-list.component';

/**
 * Page Object for the Swag Labs "Your Cart" page.
 */
export class CartPage {
    /** Primary header with the cart button and badge */
    readonly header: HeaderComponent;
    /** Cart line items */
    readonly products: ProductListComponent;

    constructor(private readonly page: Page) {
        this.header = new HeaderComponent(page);
        this.products = new ProductListComponent(page);
    }

    // ==================== Locators ====================

    get continueShoppingButton(): Locator {
        return this.page.getByRole('button', { name: 'Continue Shopping' });
    }

    get checkoutButton(): Locator {
        return this.page.getByRole('button', { name: 'Checkout' });
    }

    // ==================== Actions ====================

    /**
     * Opens the cart page using the configured APP_URL.
     *
     * @returns {Promise<void>} Resolves when navigation is complete.
     */
    async open(): Promise<void> {
        await this.page.goto(`${process.env.APP_URL!}${AppRoutes.CART}`, {
            waitUntil: 'domcontentloaded',
        });
    }

    /**
     * Proceeds from the cart to checkout step one.
     *
     * @returns {Promise<void>} Resolves when the click has been performed.
     */
    async checkout(): Promise<void> {
        await this.checkoutButton.click();
    }

    /**
     * Returns from the cart to the inventory page.
     *
     * @returns {Promise<void>} Resolves when the click has been performed.
     */
    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }
}
