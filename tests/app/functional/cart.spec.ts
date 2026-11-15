import { AppRoutes } from '../../../enums/app/app';
import { expect, test } from '../../../fixtures/pom/test-options';
import { appUrl } from '../../../helpers/app/url';
import { PRODUCTS } from '../../../test-data/static/app/products';

const [product] = PRODUCTS;

test.describe('cart', () => {
    test.beforeEach(async ({ inventoryPage, cartPage }) => {
        await inventoryPage.open();
        await inventoryPage.products.addToCart(product.name);
        await cartPage.open();
    });

    test(
        'should remove the item from the cart',
        { tag: '@regression' },
        async ({ cartPage }) => {
            await test.step('WHEN user removes the item', async () => {
                await cartPage.products.removeFromCart(product.name);
            });

            await test.step('THEN the cart is empty', async () => {
                await expect(cartPage.products.items).toHaveCount(0);
            });
        }
    );

    test(
        'should return to the inventory on continue shopping',
        { tag: '@regression' },
        async ({ cartPage, page }) => {
            await cartPage.continueShopping();
            await expect(page).toHaveURL(appUrl(AppRoutes.INVENTORY));
        }
    );

    test(
        'should go to checkout step one on checkout',
        { tag: '@regression' },
        async ({ cartPage, page }) => {
            await cartPage.checkout();
            await expect(page).toHaveURL(appUrl(AppRoutes.CHECKOUT_STEP_ONE));
        }
    );
});
