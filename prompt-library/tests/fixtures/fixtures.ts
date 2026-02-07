import { test } from 'vitest'
import os from 'node:os'
import path from 'node:path'
import { mkdtemp, rm, chmod } from 'node:fs/promises'
import { readFileSync } from 'node:fs'

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

interface TestWithAssetsFixtures {
    readAsset: (assetKey: string) => Buffer
}

const assetsDirPath = path.resolve(path.join(__dirname, '../assets'))
export const testWithAssets = test.extend<TestWithAssetsFixtures>({
    // eslint-disable-next-line no-empty-pattern
    readAsset: async ({}, use) => {
        await use((assetKey: string): Buffer => readFileSync(path.join(assetsDirPath, assetKey)))
    }
})
