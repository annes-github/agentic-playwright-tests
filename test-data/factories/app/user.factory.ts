import { faker } from '@faker-js/faker';
import {
    LoginCredentials,
    LoginCredentialsSchema,
} from '../../../fixtures/api/schemas/app/loginSchema';

/**
 * Generates random login credentials. The values match no registered
 * Swag Labs account, so they serve as the "unknown user" negative case.
 *
 * @param {Partial<LoginCredentials>} overrides - Fields to pin for the test.
 * @returns {LoginCredentials} Credentials that satisfy LoginCredentialsSchema.
 */
export const generateLoginCredentials = (
    overrides?: Partial<LoginCredentials>
): LoginCredentials => {
    const defaults: LoginCredentials = {
        username: faker.internet.username(),
        password: faker.internet.password({ length: 12 }),
    };

    return LoginCredentialsSchema.parse({ ...defaults, ...overrides });
};
