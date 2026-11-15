import { AppRoutes, Messages } from '../../../enums/app/app';
import type { CheckoutInfo } from '../../../fixtures/api/schemas/app/checkoutSchema';
import { expect, test } from '../../../fixtures/pom/test-options';
import { appUrl } from '../../../helpers/app/url';
import { generateCheckoutInfo } from '../../../test-data/factories/app/checkout.factory';

/** Each required field and the validation error shown when it is blank. */
const REQUIRED_FIELDS: ReadonlyArray<{
    field: keyof CheckoutInfo;
    message: Messages;
}> = [
    { field: 'firstName', message: Messages.FIRST_NAME_REQUIRED },
    { field: 'lastName', message: Messages.LAST_NAME_REQUIRED },
    { field: 'postalCode', message: Messages.POSTAL_CODE_REQUIRED },
];

test.describe('checkout information', () => {
    test.beforeEach(async ({ checkoutInformationPage }) => {
        await checkoutInformationPage.open();
    });

    test(
        'should continue to the overview with valid information',
        { tag: '@regression' },
        async ({ checkoutInformationPage, page }) => {
            await test.step('WHEN user submits every field', async () => {
                await checkoutInformationPage.submit(generateCheckoutInfo());
            });

            await test.step('THEN the overview opens', async () => {
                await expect(page).toHaveURL(
                    appUrl(AppRoutes.CHECKOUT_STEP_TWO)
                );
            });
        }
    );

    for (const { field, message } of REQUIRED_FIELDS) {
        test(
            `should show an error when ${field} is blank`,
            { tag: '@regression' },
            async ({ checkoutInformationPage, page }) => {
                const { [field]: _blank, ...info } = generateCheckoutInfo();

                await test.step(`WHEN user submits without ${field}`, async () => {
                    await checkoutInformationPage.submit(info);
                });

                await test.step('THEN the field error is shown', async () => {
                    await expect(
                        checkoutInformationPage.errorMessage
                    ).toHaveText(message);
                    await expect(page).toHaveURL(
                        appUrl(AppRoutes.CHECKOUT_STEP_ONE)
                    );
                });
            }
        );
    }
});
