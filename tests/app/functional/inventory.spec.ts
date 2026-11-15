import { AppRoutes, LineItem, SortOptions } from '../../../enums/app/app';
import { expect, test } from '../../../fixtures/pom/test-options';
import { sortPrices } from '../../../helpers/app/price';
import { appUrl } from '../../../helpers/app/url';
import { PRODUCTS } from '../../../test-data/static/app/products';

const productNames = PRODUCTS.map((product) => product.name);
const productPrices = PRODUCTS.map((product) => product.price);
const [backpack, bikeLight, boltTShirt] = PRODUCTS;

/** Each non-default sort option and the list it must produce. */
const SORT_CASES = [
    {
        description: 'name Z to A',
        option: SortOptions.NAME_DESC,
        column: 'names',
        expected: [...productNames].sort().reverse(),
    },
    {
        description: 'price low to high',
        option: SortOptions.PRICE_ASC,
        column: 'prices',
        expected: sortPrices(productPrices, 'ascending'),
    },
    {
        description: 'price high to low',
        option: SortOptions.PRICE_DESC,
        column: 'prices',
        expected: sortPrices(productPrices, 'descending'),
    },
] as const;

test.describe('inventory', () => {
    test.beforeEach(async ({ inventoryPage }) => {
        await inventoryPage.open();
    });

    test(
        'should sort products by name A to Z by default',
        { tag: '@regression' },
        async ({ inventoryPage }) => {
            await expect(inventoryPage.sortDropdown).toHaveValue(
                SortOptions.NAME_ASC
            );
            await expect(inventoryPage.products.names).toHaveText(
                [...productNames].sort()
            );
        }
    );

    for (const { description, option, column, expected } of SORT_CASES) {
        test(
            `should sort products by ${description}`,
            { tag: '@regression' },
            async ({ inventoryPage }) => {
                await test.step(`WHEN user sorts by ${description}`, async () => {
                    await inventoryPage.sortBy(option);
                });

                await test.step('THEN the products are listed in that order', async () => {
                    await expect(inventoryPage.sortDropdown).toHaveValue(
                        option
                    );
                    await expect(inventoryPage.products[column]).toHaveText(
                        expected
                    );
                });
            }
        );
    }

    test(
        'should list every product name',
        { tag: '@regression' },
        async ({ inventoryPage }) => {
            await expect(inventoryPage.products.names).toHaveText(productNames);
        }
    );

    test(
        'should list every product price',
        { tag: '@regression' },
        async ({ inventoryPage }) => {
            await expect(inventoryPage.products.prices).toHaveText(
                productPrices
            );
        }
    );

    test(
        'should list every product description',
        { tag: '@regression' },
        async ({ inventoryPage }) => {
            await expect(inventoryPage.products.descriptions).toHaveText(
                PRODUCTS.map((product) => product.description)
            );
        }
    );

    test(
        'should show an enabled add-to-cart button for each product',
        { tag: '@regression' },
        async ({ inventoryPage }) => {
            const { products } = inventoryPage;
            await expect(products.items).toHaveCount(PRODUCTS.length);
            for (const { name } of PRODUCTS) {
                const button = products.addToCartButtonOf(
                    products.itemByName(name)
                );
                await expect(button).toBeVisible();
                await expect(button).toBeEnabled();
            }
        }
    );

    test(
        'should show an image for each product',
        { tag: '@regression' },
        async ({ inventoryPage }) => {
            for (const { name } of PRODUCTS) {
                await expect(
                    inventoryPage.products.imageFor(name)
                ).toBeVisible();
            }
        }
    );

    test(
        'should add a product to the cart',
        { tag: '@smoke' },
        async ({ inventoryPage, cartPage, page }) => {
            await test.step('WHEN user adds a product to the cart', async () => {
                await inventoryPage.products.addToCart(backpack.name);
            });

            await test.step('THEN the cart badge counts it', async () => {
                await expect(inventoryPage.header.cartBadge).toHaveText(
                    LineItem.DEFAULT_QUANTITY
                );
            });

            await test.step('AND the cart lists it once', async () => {
                await inventoryPage.header.openCart();
                await expect(page).toHaveURL(appUrl(AppRoutes.CART));
                const item = cartPage.products.itemByName(backpack.name);
                await expect(item).toBeVisible();
                await expect(cartPage.products.quantityOf(item)).toHaveText(
                    LineItem.DEFAULT_QUANTITY
                );
            });
        }
    );

    test(
        'should remove products from the cart',
        { tag: '@regression' },
        async ({ inventoryPage, cartPage, page }) => {
            const { header, products } = inventoryPage;
            const toAdd = [bikeLight, boltTShirt];

            await test.step('GIVEN two products are in the cart', async () => {
                for (const { name } of toAdd) {
                    await products.addToCart(name);
                }
                await expect(header.cartBadge).toHaveText(String(toAdd.length));
            });

            await test.step('WHEN user removes them one by one', async () => {
                await products.removeFromCart(bikeLight.name);
                await expect(header.cartBadge).toHaveText(
                    String(toAdd.length - 1)
                );
                await products.removeFromCart(boltTShirt.name);
            });

            await test.step('THEN the cart is empty', async () => {
                await expect(header.cartBadge).toBeHidden();
                await header.openCart();
                await expect(page).toHaveURL(appUrl(AppRoutes.CART));
                await expect(cartPage.products.items).toHaveCount(0);
            });
        }
    );
});
