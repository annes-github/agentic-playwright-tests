import { Locator, Page } from '@playwright/test';
import { AppRoutes, SortOptions } from '../../enums/app/app';
import { HeaderComponent } from '../components/header.component';
import { ProductListComponent } from '../components/product-list.component';

/**
 * Page Object for the Swag Labs inventory ("Products") page.
 */
export class InventoryPage {
    /** Primary header with the cart button and badge */
    readonly header: HeaderComponent;
    /** Product cards */
    readonly products: ProductListComponent;

    constructor(private readonly page: Page) {
        this.header = new HeaderComponent(page);
        this.products = new ProductListComponent(page);
    }

    // ==================== Locators ====================

    get sortDropdown(): Locator {
        return this.page.getByRole('combobox', { name: 'Sort products' });
    }

    // ==================== Actions ====================

    /**
     * Opens the inventory page using the configured APP_URL.
     *
     * @returns {Promise<void>} Resolves when navigation is complete.
     */
    async open(): Promise<void> {
        await this.page.goto(`${process.env.APP_URL!}${AppRoutes.INVENTORY}`, {
            waitUntil: 'domcontentloaded',
        });
    }

    /**
     * Sorts the product list.
     *
     * @param {SortOptions} option - The sort option value to select.
     * @returns {Promise<void>} Resolves when the option is selected.
     */
    async sortBy(option: SortOptions): Promise<void> {
        await this.sortDropdown.selectOption(option);
    }
}
