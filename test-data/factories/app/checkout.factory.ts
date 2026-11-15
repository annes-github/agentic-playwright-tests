import { faker } from '@faker-js/faker';
import {
    CheckoutInfo,
    CheckoutInfoSchema,
} from '../../../fixtures/api/schemas/app/checkoutSchema';

/**
 * Generates valid checkout information with randomized data.
 *
 * @param {Partial<CheckoutInfo>} overrides - Fields to pin for the test.
 * @returns {CheckoutInfo} Checkout information that satisfies CheckoutInfoSchema.
 */
export const generateCheckoutInfo = (
    overrides?: Partial<CheckoutInfo>
): CheckoutInfo => {
    const defaults: CheckoutInfo = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        postalCode: faker.location.zipCode(),
    };

    return CheckoutInfoSchema.parse({ ...defaults, ...overrides });
};
