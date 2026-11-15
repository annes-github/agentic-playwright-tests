import { Locator, Page } from '@playwright/test';

/**
 * Component Object for the list of product cards shared by the inventory,
 * cart and checkout overview pages. Every card is a `data-test="inventory-item"`
 * container; name, description, price and quantity carry no role or label,
 * so they are located by test id.
 */
export class ProductListComponent {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    get items(): Locator {
        return this.page.getByTestId('inventory-item');
    }

    get names(): Locator {
        return this.items.getByTestId('inventory-item-name');
    }

    get descriptions(): Locator {
        return this.items.getByTestId('inventory-item-desc');
    }

    get prices(): Locator {
        return this.items.getByTestId('inventory-item-price');
    }

    itemByName(productName: string): Locator {
        return this.items.filter({
            has: this.page
                .getByTestId('inventory-item-name')
                .getByText(productName, { exact: true }),
        });
    }

    imageFor(productName: string): Locator {
        return this.items.getByRole('img', { name: productName, exact: true });
    }

    nameOf(item: Locator): Locator {
        return item.getByTestId('inventory-item-name');
    }

    descriptionOf(item: Locator): Locator {
        return item.getByTestId('inventory-item-desc');
    }

    priceOf(item: Locator): Locator {
        return item.getByTestId('inventory-item-price');
    }

    quantityOf(item: Locator): Locator {
        return item.getByTestId('item-quantity');
    }

    addToCartButtonOf(item: Locator): Locator {
        return item.getByRole('button', { name: 'Add to cart' });
    }

    removeButtonOf(item: Locator): Locator {
        return item.getByRole('button', { name: 'Remove' });
    }

    // ==================== Actions ====================

    /**
     * Adds a product to the cart from its card.
     *
     * @param {string} productName - The product's displayed name.
     * @returns {Promise<void>} Resolves when the click has been performed.
     */
    async addToCart(productName: string): Promise<void> {
        await this.addToCartButtonOf(this.itemByName(productName)).click();
    }

    /**
     * Removes a product from the cart from its card.
     *
     * @param {string} productName - The product's displayed name.
     * @returns {Promise<void>} Resolves when the click has been performed.
     */
    async removeFromCart(productName: string): Promise<void> {
        await this.removeButtonOf(this.itemByName(productName)).click();
    }
}
