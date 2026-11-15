/**
 * auth.setup.ts
 * Playwright setup script for the browser storage state (`setup-ui` project).
 *
 * Signs in through the login page once per run and saves cookies and web
 * storage to `StorageStatePaths.APP`; the `chromium` project loads that file,
 * so UI tests start signed in.
 */

import * as fs from 'node:fs';
import { expect, test } from '../../fixtures/pom/test-options';
import { StorageStatePaths } from '../../enums/app/app';
import { createAppStorageState } from '../../helpers/app/createStorageState';

test.describe('auth setup - UI', () => {
    test('setup authentication - browser storage state', async () => {
        await createAppStorageState();
        expect(fs.existsSync(StorageStatePaths.APP)).toBe(true);
    });
});
