import { Pricing } from '../../enums/app/app';

/** Sort direction for a list of prices */
export type SortDirection = 'ascending' | 'descending';

/**
 * Converts a displayed price string to a number.
 *
 * @param {string} priceText - A price as rendered by the app, e.g. `"$29.99"`.
 * @returns {number} The numeric value, e.g. `29.99`.
 */
export function priceToNumber(priceText: string): number {
    return parseFloat(priceText.replace(/[^0-9.]/g, ''));
}

/**
 * Formats a number the way the app renders prices.
 *
 * @param {number} value - The amount, e.g. `3.1984`.
 * @returns {string} The rounded, dollar-prefixed price, e.g. `"$3.20"`.
 */
export function formatPrice(value: number): string {
    return `$${value.toFixed(Pricing.CURRENCY_DECIMALS)}`;
}

/**
 * Returns a sorted copy of a list of displayed prices.
 *
 * @param {readonly string[]} prices - Prices as rendered by the app.
 * @param {SortDirection} direction - `ascending` (low to high) or `descending`.
 * @returns {string[]} A new array sorted by numeric value.
 */
export function sortPrices(
    prices: readonly string[],
    direction: SortDirection
): string[] {
    const sign = direction === 'ascending' ? 1 : -1;
    return [...prices].sort(
        (a, b) => sign * (priceToNumber(a) - priceToNumber(b))
    );
}

/**
 * Computes the checkout overview amounts for a set of displayed prices,
 * rounded to cents the way the app rounds them.
 *
 * @param {readonly string[]} prices - Prices of the items in the order.
 * @returns {{ itemTotal: number; tax: number; total: number }} The item total, tax and grand total.
 */
export function calculateOrderTotals(prices: readonly string[]): {
    itemTotal: number;
    tax: number;
    total: number;
} {
    const round = (value: number): number =>
        Number(value.toFixed(Pricing.CURRENCY_DECIMALS));
    const itemTotal = round(
        prices.reduce((sum, price) => sum + priceToNumber(price), 0)
    );
    const tax = round(itemTotal * Pricing.TAX_RATE);
    return { itemTotal, tax, total: round(itemTotal + tax) };
}
