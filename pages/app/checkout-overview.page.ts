import { Locator, Page } from '@playwright/test';
import { Messages } from '../../enums/app/app';
import { ProductListComponent } from '../components/product-list.component';

/**
 * Page Object for "Checkout: Overview" (checkout step two).
 * The summary values carry no role or label, so they are located by test id.
 */
export class CheckoutOverviewPage {
    /** Order line items */
    readonly products: ProductListComponent;

    constructor(private readonly page: Page) {
        this.products = new ProductListComponent(page);
    }

    // ==================== Locators ====================

    get paymentInformationLabel(): Locator {
        return this.page.getByText(Messages.PAYMENT_INFORMATION_LABEL);
    }

    get paymentInformationValue(): Locator {
        return this.page.getByTestId('payment-info-value');
    }

    get shippingInformationLabel(): Locator {
        return this.page.getByText(Messages.SHIPPING_INFORMATION_LABEL);
    }

    get shippingInformationValue(): Locator {
        return this.page.getByTestId('shipping-info-value');
    }

    get priceTotalLabel(): Locator {
        return this.page.getByText(Messages.PRICE_TOTAL_LABEL, {
            exact: true,
        });
    }

    get itemTotal(): Locator {
        return this.page.getByTestId('subtotal-label');
    }

    get tax(): Locator {
        return this.page.getByTestId('tax-label');
    }

    get total(): Locator {
        return this.page.getByTestId('total-label');
    }

    get cancelButton(): Locator {
        return this.page.getByRole('button', { name: 'Cancel' });
    }

    get finishButton(): Locator {
        return this.page.getByRole('button', { name: 'Finish' });
    }

    // ==================== Actions ====================

    /**
     * Cancels the order and returns to the inventory page.
     *
     * @returns {Promise<void>} Resolves when the click has been performed.
     */
    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    /**
     * Places the order.
     *
     * @returns {Promise<void>} Resolves when the click has been performed.
     */
    async finish(): Promise<void> {
        await this.finishButton.click();
    }
}
