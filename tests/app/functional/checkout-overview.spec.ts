import { AppRoutes, LineItem, Messages } from '../../../enums/app/app';
import { expect, test } from '../../../fixtures/pom/test-options';
import { calculateOrderTotals, formatPrice } from '../../../helpers/app/price';
import { appUrl } from '../../../helpers/app/url';
import { generateCheckoutInfo } from '../../../test-data/factories/app/checkout.factory';
import { PRODUCTS } from '../../../test-data/static/app/products';

const productsToBuy = PRODUCTS.slice(0, 2);

test.describe('checkout overview', () => {
    test.beforeEach(
        async ({ inventoryPage, cartPage, checkoutInformationPage, page }) => {
            await inventoryPage.open();
            for (const { name } of productsToBuy) {
                await inventoryPage.products.addToCart(name);
            }
            await inventoryPage.header.openCart();
            await cartPage.checkout();
            await checkoutInformationPage.submit(generateCheckoutInfo());
            await page.waitForURL(appUrl(AppRoutes.CHECKOUT_STEP_TWO));
        }
    );

    test(
        'should show name, description, price and quantity of each item',
        { tag: '@regression' },
        async ({ checkoutOverviewPage }) => {
            const { products } = checkoutOverviewPage;
            await expect(products.items).toHaveCount(productsToBuy.length);
            for (const { name, description, price } of productsToBuy) {
                const item = products.itemByName(name);
                await expect(products.nameOf(item)).toHaveText(name);
                await expect(products.descriptionOf(item)).toHaveText(
                    description
                );
                await expect(products.priceOf(item)).toHaveText(price);
                await expect(products.quantityOf(item)).toHaveText(
                    LineItem.DEFAULT_QUANTITY
                );
            }
        }
    );

    test(
        'should show the payment information',
        { tag: '@regression' },
        async ({ checkoutOverviewPage }) => {
            await expect(
                checkoutOverviewPage.paymentInformationLabel
            ).toBeVisible();
            await expect(
                checkoutOverviewPage.paymentInformationValue
            ).toHaveText(Messages.PAYMENT_CARD);
        }
    );

    test(
        'should show the shipping information',
        { tag: '@regression' },
        async ({ checkoutOverviewPage }) => {
            await expect(
                checkoutOverviewPage.shippingInformationLabel
            ).toBeVisible();
            await expect(
                checkoutOverviewPage.shippingInformationValue
            ).toHaveText(Messages.SHIPPING_METHOD);
        }
    );

    test(
        'should show item total, tax and total',
        { tag: '@regression' },
        async ({ checkoutOverviewPage }) => {
            const { itemTotal, tax, total } = calculateOrderTotals(
                productsToBuy.map((product) => product.price)
            );

            await expect(checkoutOverviewPage.priceTotalLabel).toBeVisible();
            await expect(checkoutOverviewPage.itemTotal).toHaveText(
                `${Messages.ITEM_TOTAL_PREFIX}${formatPrice(itemTotal)}`
            );
            await expect(checkoutOverviewPage.tax).toHaveText(
                `${Messages.TAX_PREFIX}${formatPrice(tax)}`
            );
            await expect(checkoutOverviewPage.total).toHaveText(
                `${Messages.TOTAL_PREFIX}${formatPrice(total)}`
            );
        }
    );

    test(
        'should return to the inventory on cancel',
        { tag: '@regression' },
        async ({ checkoutOverviewPage, page }) => {
            await checkoutOverviewPage.cancel();
            await expect(page).toHaveURL(appUrl(AppRoutes.INVENTORY));
        }
    );

    test(
        'should complete the order on finish',
        { tag: '@regression' },
        async ({ checkoutOverviewPage, checkoutCompletePage, page }) => {
            await checkoutOverviewPage.finish();
            await expect(page).toHaveURL(appUrl(AppRoutes.CHECKOUT_COMPLETE));
            await expect(
                checkoutCompletePage.confirmationHeading
            ).toBeVisible();
        }
    );
});
