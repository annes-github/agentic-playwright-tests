/**
 * Application-specific constants for the Swag Labs (SauceDemo) storefront.
 *
 * @example
 * ```ts
 * import { Messages, AppRoutes } from '../../enums/app/app';
 *
 * await expect(loginPage.errorMessage).toHaveText(Messages.LOGIN_INVALID_CREDENTIALS);
 * ```
 */

/** UI messages and labels — every value verified against the live app */
export enum Messages {
    LOGIN_INVALID_CREDENTIALS = 'Epic sadface: Username and password do not match any user in this service',
    FIRST_NAME_REQUIRED = 'Error: First Name is required',
    LAST_NAME_REQUIRED = 'Error: Last Name is required',
    POSTAL_CODE_REQUIRED = 'Error: Postal Code is required',
    PAYMENT_INFORMATION_LABEL = 'Payment Information:',
    SHIPPING_INFORMATION_LABEL = 'Shipping Information:',
    PRICE_TOTAL_LABEL = 'Price Total',
    PAYMENT_CARD = 'SauceCard #31337',
    SHIPPING_METHOD = 'Free Pony Express Delivery!',
    ITEM_TOTAL_PREFIX = 'Item total: ',
    TAX_PREFIX = 'Tax: ',
    TOTAL_PREFIX = 'Total: ',
    ORDER_COMPLETE = 'Thank you for your order!',
}

/** UI route paths, relative to APP_URL */
export enum AppRoutes {
    LOGIN = '/',
    INVENTORY = '/inventory.html',
    CART = '/cart.html',
    CHECKOUT_STEP_ONE = '/checkout-step-one.html',
    CHECKOUT_STEP_TWO = '/checkout-step-two.html',
    CHECKOUT_COMPLETE = '/checkout-complete.html',
}

/** Option values of the "Sort products" combobox on the inventory page */
export enum SortOptions {
    NAME_ASC = 'az',
    NAME_DESC = 'za',
    PRICE_ASC = 'lohi',
    PRICE_DESC = 'hilo',
}

/** Pricing rules applied by the checkout overview */
export enum Pricing {
    TAX_RATE = 0.08,
    CURRENCY_DECIMALS = 2,
}

/** Cart line-item values rendered by the app */
export enum LineItem {
    DEFAULT_QUANTITY = '1',
}

/** Auth state file written by the setup project (`tests/app/auth.setup.ts`) */
export enum StorageStatePaths {
    APP = '.auth/app/appStorageState.json',
}
