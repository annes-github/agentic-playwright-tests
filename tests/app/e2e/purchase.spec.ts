import { AppRoutes, LineItem } from '../../../enums/app/app';
import { expect, test } from '../../../fixtures/pom/test-options';
import { appUrl } from '../../../helpers/app/url';
import { generateCheckoutInfo } from '../../../test-data/factories/app/checkout.factory';
import { PRODUCTS } from '../../../test-data/static/app/products';

const [product] = PRODUCTS;

test.describe('e2e purchase', () => {
    test.beforeEach(async ({ inventoryPage }) => {
        await inventoryPage.open();
    });

    test(
        'should buy a product from the inventory through to confirmation',
        { tag: '@e2e' },
        async ({
            inventoryPage,
            cartPage,
            checkoutInformationPage,
            checkoutOverviewPage,
            checkoutCompletePage,
            page,
        }) => {
            await test.step('GIVEN user adds a product to the cart', async () => {
                await inventoryPage.products.addToCart(product.name);
                await expect(inventoryPage.header.cartBadge).toHaveText(
                    LineItem.DEFAULT_QUANTITY
                );
            });

            await test.step('WHEN user checks out with their details', async () => {
                await inventoryPage.header.openCart();
                await expect(
                    cartPage.products.itemByName(product.name)
                ).toBeVisible();
                await cartPage.checkout();
                await checkoutInformationPage.submit(generateCheckoutInfo());
                await expect(
                    checkoutOverviewPage.products.itemByName(product.name)
                ).toBeVisible();
                await checkoutOverviewPage.finish();
            });

            await test.step('THEN the order is confirmed and the cart emptied', async () => {
                await expect(page).toHaveURL(
                    appUrl(AppRoutes.CHECKOUT_COMPLETE)
                );
                await expect(
                    checkoutCompletePage.confirmationHeading
                ).toBeVisible();
                await expect(inventoryPage.header.cartBadge).toBeHidden();
            });
        }
    );
});
