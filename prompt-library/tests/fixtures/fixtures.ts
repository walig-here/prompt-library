import { test } from 'vitest'
import os from 'node:os'
import path from 'node:path'
import { mkdtemp, rm, chmod } from 'node:fs/promises'

interface FileSystemTestFixtures {
    tmpdir: string
}

/**
 * Integration test that works on real filesystem.
 */
export const filesystemTest = test.extend<FileSystemTestFixtures>({
    // eslint-disable-next-line no-empty-pattern
    tmpdir: async ({}, use) => {
        const osTemporaryDirPath = os.tmpdir()
        const testTemporaryDir = await mkdtemp(
            path.join(osTemporaryDirPath, `prompt_library_test_`)
        )

        await use(testTemporaryDir)

        await chmod(testTemporaryDir, 0o777)
        await rm(testTemporaryDir, { recursive: true })
    }
})
