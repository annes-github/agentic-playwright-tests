# Sauce Demo – Playwright Test Suite

End-to-end tests for [Sauce Demo](https://www.saucedemo.com), a practice e-commerce site, written in TypeScript with [Playwright](https://playwright.dev). The suite covers the main shopping flow, from login through checkout, and runs in Chromium, Firefox and WebKit.

The project is built on the [`create-agentic-playwright`](docs/SCAFFOLD.md) scaffold, a Playwright framework with a written rulebook ([`AGENTS.md`](AGENTS.md)) that both people and AI coding agents follow, enforced by ESLint and pre-write checks.

## Background

This suite started as a hand-written Playwright project: [annes-github/playwright-tests](https://github.com/annes-github/playwright-tests). I then ported it into this agentic testing framework, where an AI coding agent works under a written rulebook and project-specific skills. The agent explored the live app, proposed a plan for my approval, and rebuilt the suite to the framework's standards, while I made the decisions along the way, such as which tests to keep and which parts of the scaffold to remove. Comparing the two repositories shows the same test design, before and after.

## What's covered

| Area                           | What's tested                                                                                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Login**                      | Valid credentials, invalid credentials                                                                                                                           |
| **Product page**               | Default A–Z sort, Z–A and price sorting, every product's name, price, description and image, an "Add to cart" button for each product, adding and removing items |
| **Cart**                       | Removing an item, Continue Shopping, going to checkout                                                                                                           |
| **Checkout: your information** | Required-field errors for first name, last name and zip code, valid submission                                                                                   |
| **Checkout: overview**         | Name, description, price and quantity for each product, payment and shipping info, item total, tax and order total, Cancel and Finish                            |
| **End-to-end purchase**        | One journey from adding a product through to the order confirmation                                                                                              |

## Approach

- **Page Object Model with components.** Each page has a class in `pages/app/` that keeps its locators and actions in one place. The product, cart and checkout overview pages all show lists of products, so that list is a shared component (`pages/components/product-list.component.ts`) with helpers like `priceOf(item)`. The header's cart button and badge are a second component.
- **Page objects as fixtures.** Tests never create page objects themselves; they ask for them by name (`async ({ inventoryPage, cartPage }) => …`) and Playwright provides them through `fixtures/pom/page-object-fixture.ts`.
- **Accessible locators first.** Elements are found by role and accessible name (`getByRole('button', { name: 'Checkout' })`) wherever the app allows it, falling back to `data-test` ids only for text with no role or label, such as prices and descriptions.
- **Logging in once.** A setup project ([`tests/app/auth.setup.ts`](tests/app/auth.setup.ts)) logs in and saves the browser session. All other tests reuse it, so they start directly on the page they test. The login tests clear the session first.
- **Expected values come from test data.** Product names, prices and descriptions are stored in [`test-data/static/app/products.ts`](test-data/static/app/products.ts) and used for the expected values in tests. Error messages, routes and sort options live in [`enums/app/app.ts`](enums/app/app.ts), each one copied from the live app.
- **Generated input data.** Names, zip codes and invalid login credentials are generated fresh for every run with [Faker](https://fakerjs.dev) (`test-data/factories/app/`), so no test depends on a hardcoded value.
- **One tag per test.** Each test is tagged `@smoke`, `@regression` or `@e2e`, so a subset can be run on its own.
- **Linting.** ESLint with [`eslint-plugin-playwright`](https://github.com/playwright-community/eslint-plugin-playwright) flags common mistakes, such as a missing `await` on a Playwright call, and runs with zero warnings allowed.

## Project structure

```
├── enums/app/app.ts           # Messages, routes, sort options, tax rate
├── fixtures/
│   ├── pom/                   # Page-object fixtures; test-options.ts is the single import for test/expect
│   └── api/schemas/app/       # Zod schemas for the checkout and login data
├── helpers/app/               # Price parsing/sorting/totals, URL builder, login-once setup
├── pages/
│   ├── app/                   # One page object per page: login, inventory, cart, checkout ×3
│   └── components/            # Header and product list, shared across pages
├── test-data/
│   ├── factories/app/         # Faker generators for checkout info and login credentials
│   └── static/app/products.ts # Expected product names, prices and descriptions
├── tests/app/
│   ├── auth.setup.ts          # Logs in once and saves the session
│   ├── functional/            # One spec per page or area
│   └── e2e/                   # Full purchase journey
├── docs/SCAFFOLD.md           # The scaffold's full framework guide
├── AGENTS.md                  # The project rules
└── playwright.config.ts
```

## Running the tests

Requires [Node.js](https://nodejs.org) 22 or newer.

Copy the example environment file and fill in the Sauce Demo login (the accepted usernames and password are shown on the [login page](https://www.saucedemo.com)):

```bash
cp env/.env.example env/.env.dev
```

```bash
APP_URL=https://www.saucedemo.com
APP_EMAIL=standard_user        # Sauce Demo signs in with a username
APP_PASSWORD=<the password shown on the login page>
```

Then:

```bash
npm install
npx playwright install       # download the browsers
npm test                     # run the suite in all three browsers
npx playwright show-report   # open the HTML report
```

Other useful commands:

```bash
npm run test:chromium     # one browser only (also test:firefox, test:webkit)
npm run test:smoke        # only @smoke tests
npm run test:regression   # only @regression tests
npm run test:e2e          # only the end-to-end journey
npm run test:ui           # interactive UI mode
npm run test:headed       # watch the browser
npm run lint              # run ESLint
```

## More about the framework

[`docs/SCAFFOLD.md`](docs/SCAFFOLD.md) is the scaffold's full guide: configuration, tagging rules, the pre-commit and rule-enforcement hooks, and how AI agents are set up to work in this repository.
