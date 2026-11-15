# Auth bootstrap

How the scaffold signs in once per run and hands the result to every worker. The live files are `tests/app/auth.setup.ts` (the `setup-ui` project: the browser storage state) and `helpers/app/createStorageState.ts`. In `playwright.config.ts` the `chromium` project depends on `setup-ui`. The app under test (Swag Labs) has no API, so there is no API token today.

## The chain

1. `createAppStorageState()` opens a browser, signs in through `LoginPage.loginAndVerify()` with `process.env.APP_EMAIL` (the Swag Labs username) / `APP_PASSWORD`, and writes cookies and web storage to `StorageStatePaths.APP`.
2. The `chromium` project loads that file, so UI tests start signed in. A spec that must start signed out calls `resetStorageState()` in `beforeEach`.

## Adding an API token (when an API area appears)

Mirror the UI chain for the token: a `tests/{area}/auth-api.setup.ts` in its own `setup-api` project, a mint helper in `helpers/{area}/createStorageState.ts` that posts the credentials to `ApiEndpoints.LOGIN`, asserts the login schema and writes the validated body to a `StorageStatePaths` file, and a worker-scoped auto fixture in `fixtures/api/api-request-fixture.ts` that loads it into `process.env.ACCESS_TOKEN`. The `api` project then depends on `setup-api` only, so API runs never launch a browser.

A `process.env` write is visible only inside the process that made it, which is why a token must cross the worker boundary as a file and not as an env var.

## Adapting it to another app

Replace the sign-in steps inside the mint function; keep the file paths in `StorageStatePaths`, the credentials in `process.env.*` and the verification. A second role is a second credential pair declared in `env/.env.example` and a second state file, minted the same way; never read an env var no helper populates.

## UI tests start signed out unexpectedly

- The `setup-ui` project did not run: the spec's project lost `setup-ui` in its `dependencies`, or the run filtered it out.
- The state file is stale: delete `.auth/app/appStorageState.json` and re-run; the setup writes it fresh every run.
- The login flow changed: `loginAndVerify()` fails inside the setup, so the setup test is red before any UI test runs.
