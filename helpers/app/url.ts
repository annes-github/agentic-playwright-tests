import { AppRoutes } from '../../enums/app/app';

/**
 * Builds the absolute URL of an app route from the configured APP_URL.
 *
 * @param {AppRoutes} route - The route path.
 * @returns {string} The absolute URL, e.g. `https://host/cart.html`.
 */
export function appUrl(route: AppRoutes): string {
    return new URL(route, process.env.APP_URL!).toString();
}
