/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect } from 'vitest'
import { filesystemTest } from '../../fixtures/fixtures'
import path from 'path'
import { savePrompt } from '../../../src/main/promptsApiHandlers'
import { deleteFiles, listFiles, renameFile, writeTextFile } from '../../../src/main/io'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { existsSync, statSync } from 'fs'

describe('save new prompt', () => {
    filesystemTest(
        'new prompt file should be created when it has unquie, valid name all operations succeeded',
        async ({ tmpdir }) => {
            // Assert
            const newPromptPath = path.join(tmpdir, 'prompt.md')

            // Act
            const promptCreation = await savePrompt(
                'prompt',
                'Prompt content',
                null,
                tmpdir,
                UNMOCKED_FILETOOLS
            )

            // Assert
            expect(promptCreation.success).toBeTruthy()
            expect((await readFile(newPromptPath)).toString()).toBe('Prompt content')
            expect(
                ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
            ).toStrictEqual([newPromptPath])
        }
    )

    filesystemTest(
        'new prompt file should not be created when it has not unquie name',
        async ({ tmpdir }) => {
            // Assert
            const newPromptPath = path.join(tmpdir, 'prompt.md')
            await writeFile(newPromptPath, 'Old content')

            // Act
            const promptCreation = await savePrompt(
                'prompt',
                'Prompt content',
                null,
                tmpdir,
                UNMOCKED_FILETOOLS
            )

            // Assert
            expect(promptCreation.success).toBeFalsy()
            expect((await readFile(newPromptPath)).toString()).toBe('Old content')
            expect(
                ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
            ).toStrictEqual([newPromptPath])
        }
    )

    describe.each(['', 'subsubdir/prompt', '../prompt', '~/prompt', '..', '.'])(
        'with param: %s',
        (promptTitle) => {
            filesystemTest(
                'new prompt file should not be created when it has invalid name',
                async ({ tmpdir }) => {
                    // Assert
                    await mkdir(path.join(tmpdir, 'subdir')) // to avoid not cleaning files created in ".."
                    await mkdir(path.join(tmpdir, 'subdir', 'subsubdir'))
                    const newPromptPath = path.join(tmpdir, 'subdir', `${promptTitle}.md`)

                    // Act
                    const promptCreation = await savePrompt(
                        promptTitle,
                        'Prompt content',
                        null,
                        path.join(tmpdir, 'subdir'),
                        UNMOCKED_FILETOOLS
                    )

                    // Assert
                    expect(promptCreation.success).toBeFalsy()
                    expect(
                        !existsSync(newPromptPath) || !statSync(newPromptPath).isFile()
                    ).toBeTruthy()
                    expect(
                        ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
                    ).toStrictEqual([])
                }
            )
        }
    )

    filesystemTest(
        'new prompt should not be created when it has unuqie, valid name but some operations failed',
        async ({ tmpdir }) => {
            // Assert
            const newPromptPath = path.join(tmpdir, 'prompt.md')

            // Act
            const promptCreation = await savePrompt(
                'prompt',
                'Prompt content',
                null,
                tmpdir,
                FILETOOLS_WTIH_FAILING_WRITE
            )

            // Assert
            expect(promptCreation.success).toBeFalsy()
            expect(existsSync(newPromptPath)).toBeFalsy()
            expect(
                ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
            ).toStrictEqual([])
        }
    )
})

describe('change exisiting prompt', () => {
    // Change content
    filesystemTest(
        'prompt file should be overriden when it exists and all operations succeeded',
        async ({ tmpdir }) => {
            // Assert
            const promptPath = path.join(tmpdir, 'prompt.md')
            await writeFile(promptPath, 'Old content')

            // Act
            const promptModification = await savePrompt(
                'prompt',
                'Prompt content',
                promptPath,
                tmpdir,
                UNMOCKED_FILETOOLS
            )

            // Assert
            expect(promptModification.success).toBeTruthy()
            expect((await readFile(promptPath)).toString()).toBe('Prompt content')
            expect(
                ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
            ).toStrictEqual([promptPath])
        }
    )

    filesystemTest(
        'prompt file should not be overriden when it does not exist',
        async ({ tmpdir }) => {
            // Assert
            const promptPath = path.join(tmpdir, 'prompt.md')

            // Act
            const promptModification = await savePrompt(
                'prompt',
                'Prompt content',
                promptPath,
                tmpdir,
                UNMOCKED_FILETOOLS
            )

            // Assert
            expect(promptModification.success).toBeFalsy()
            expect(existsSync(promptPath)).toBeFalsy()
            expect(
                ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
            ).toStrictEqual([])
        }
    )

    describe.each([FILETOOLS_WTIH_FAILING_WRITE, FILETOOLS_WTIH_FAILING_RENAME])(
        'with param: %s',
        (filetools) => {
            filesystemTest(
                'prompt file should not be overriden when some operation failed',
                async ({ tmpdir }) => {
                    // Assert
                    const promptPath = path.join(tmpdir, 'prompt.md')
                    await writeFile(promptPath, 'Old content')

                    // Act
                    const promptModification = await savePrompt(
                        'prompt',
                        'Prompt content',
                        promptPath,
                        tmpdir,
                        filetools
                    )

                    // Assert
                    expect(promptModification.success).toBeFalsy()
                    expect((await readFile(promptPath)).toString()).toBe('Old content')
                    expect(
                        ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
                    ).toStrictEqual([promptPath])
                }
            )
        }
    )

    // Rename
    filesystemTest(
        'prompt file should be renamed when it exists and all operations succeeded',
        async ({ tmpdir }) => {
            // Assert
            const oldPromptPath = path.join(tmpdir, 'prompt.md')
            await writeFile(oldPromptPath, 'Old content')

            // Act
            const promptModification = await savePrompt(
                'new-name',
                'Old content',
                oldPromptPath,
                tmpdir,
                UNMOCKED_FILETOOLS
            )

            // Assert
            const newPromptPath = path.join(tmpdir, 'new-name.md')
            expect(promptModification.success).toBeTruthy()
            expect((await readFile(newPromptPath)).toString()).toBe('Old content')
            expect(
                ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
            ).toStrictEqual([newPromptPath])
        }
    )

    filesystemTest(
        'prompt file should not be renamed when it does not exist',
        async ({ tmpdir }) => {
            // Assert
            const oldPromptPath = path.join(tmpdir, 'prompt.md')

            // Act
            const promptModification = await savePrompt(
                'new-name',
                'Old content',
                oldPromptPath,
                tmpdir,
                UNMOCKED_FILETOOLS
            )

            // Assert
            const newPromptPath = path.join(tmpdir, 'new-name.md')
            expect(promptModification.success).toBeFalsy()
            expect(existsSync(newPromptPath)).toBeFalsy()
            expect(
                ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
            ).toStrictEqual([])
        }
    )

    filesystemTest(
        'prompt file should not be renamed when new name is not unique',
        async ({ tmpdir }) => {
            // Assert
            const oldPromptPath = path.join(tmpdir, 'prompt.md')
            const otherPromptPath = path.join(tmpdir, 'new-name.md')
            await writeFile(oldPromptPath, 'Old content')
            await writeFile(otherPromptPath, 'Other prompt content')

            // Act
            const promptModification = await savePrompt(
                'new-name',
                'Old content',
                oldPromptPath,
                tmpdir,
                UNMOCKED_FILETOOLS
            )

            // Assert
            expect(promptModification.success).toBeFalsy()
            expect(existsSync(oldPromptPath)).toBeTruthy()
            expect((await readFile(otherPromptPath)).toString()).toBe('Other prompt content')
            expect(
                ((await listFiles(tmpdir)) as { success: true; result: string[] }).result.sort()
            ).toStrictEqual([otherPromptPath, oldPromptPath].sort())
        }
    )

    describe.each(['', 'subsubdir/prompt', '../prompt', '~/prompt', '..', '.'])(
        'with param: %s',
        (promptName) => {
            filesystemTest(
                'prompt file should not be renamed when new name is not valid',
                async ({ tmpdir }) => {
                    // Assert
                    await mkdir(path.join(tmpdir, 'subdir')) // to avoid not cleaning files created in ".."
                    await mkdir(path.join(tmpdir, 'subdir', 'subsubdir'))
                    const oldPromptPath = path.join(tmpdir, 'subdir', 'prompt.md')
                    await writeFile(oldPromptPath, 'Old content')

                    // Act
                    const promptModification = await savePrompt(
                        promptName,
                        'Old content',
                        oldPromptPath,
                        path.join(tmpdir, 'subdir'),
                        UNMOCKED_FILETOOLS
                    )

                    // Assert
                    const newPromptPath = path.join(tmpdir, 'subdir', `${promptName}.md`)
                    expect(promptModification.success).toBeFalsy()
                    expect(existsSync(oldPromptPath)).toBeTruthy()
                    expect(existsSync(newPromptPath)).toBeFalsy()
                    expect(
                        (
                            (await listFiles(path.join(tmpdir, 'subdir'))) as {
                                success: true
                                result: string[]
                            }
                        ).result
                    ).toStrictEqual([oldPromptPath])
                }
            )
        }
    )

    describe.each([FILETOOLS_WTIH_FAILING_WRITE, FILETOOLS_WTIH_FAILING_RENAME])(
        'with param: %s',
        (filetools) => {
            filesystemTest(
                'prompt file should not be renamed when some operation failed',
                async ({ tmpdir }) => {
                    // Assert
                    const oldPromptPath = path.join(tmpdir, 'prompt.md')
                    await writeFile(oldPromptPath, 'Old content')

                    // Act
                    const promptModification = await savePrompt(
                        'new-name',
                        'Old content',
                        oldPromptPath,
                        tmpdir,
                        filetools
                    )

                    // Assert
                    const newPromptPath = path.join(tmpdir, 'new-name.md')
                    expect(promptModification.success).toBeFalsy()
                    expect(existsSync(oldPromptPath)).toBeTruthy()
                    expect(existsSync(newPromptPath)).toBeFalsy()
                    expect(
                        ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
                    ).toStrictEqual([oldPromptPath])
                }
            )
        }
    )

    // Rename & change content
    filesystemTest(
        'prompt file should be renamed and overriden when it exists and all operations succeeded',
        async ({ tmpdir }) => {
            // Assert
            const oldPromptPath = path.join(tmpdir, 'prompt.md')
            await writeFile(oldPromptPath, 'Old content')

            // Act
            const promptModification = await savePrompt(
                'new-name',
                'New content',
                oldPromptPath,
                tmpdir,
                UNMOCKED_FILETOOLS
            )

            // Assert
            const newPromptPath = path.join(tmpdir, 'new-name.md')
            expect(promptModification.success).toBeTruthy()
            expect((await readFile(newPromptPath)).toString()).toBe('New content')
            expect(
                ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
            ).toStrictEqual([newPromptPath])
        }
    )

    filesystemTest(
        'prompt file should not be renamed and overriden when it does not exist',
        async ({ tmpdir }) => {
            // Assert
            const oldPromptPath = path.join(tmpdir, 'prompt.md')

            // Act
            const promptModification = await savePrompt(
                'new-name',
                'New content',
                oldPromptPath,
                tmpdir,
                UNMOCKED_FILETOOLS
            )

            // Assert
            const newPromptPath = path.join(tmpdir, 'new-name.md')
            expect(promptModification.success).toBeFalsy()
            expect(existsSync(newPromptPath)).toBeFalsy()
            expect(
                ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
            ).toStrictEqual([])
        }
    )

    filesystemTest(
        'prompt file should not be renamed nor overriden when new name is not unique',
        async ({ tmpdir }) => {
            // Assert
            const oldPromptPath = path.join(tmpdir, 'prompt.md')
            const otherPromptPath = path.join(tmpdir, 'new-name.md')
            await writeFile(oldPromptPath, 'Old content')
            await writeFile(otherPromptPath, 'Other prompt content')

            // Act
            const promptModification = await savePrompt(
                'new-name',
                'New content',
                oldPromptPath,
                tmpdir,
                UNMOCKED_FILETOOLS
            )

            // Assert
            expect(promptModification.success).toBeFalsy()
            expect((await readFile(oldPromptPath)).toString()).toBe('Old content')
            expect((await readFile(otherPromptPath)).toString()).toBe('Other prompt content')
            expect(
                ((await listFiles(tmpdir)) as { success: true; result: string[] }).result.sort()
            ).toStrictEqual([otherPromptPath, oldPromptPath].sort())
        }
    )

    describe.each(['', 'subsubdir/prompt', '../prompt', '~/prompt', '..', '.'])(
        'with param: %s',
        (promptName) => {
            filesystemTest(
                'prompt file should not be renamed nor overriden when new name is not valid',
                async ({ tmpdir }) => {
                    // Assert
                    await mkdir(path.join(tmpdir, 'subdir')) // to avoid not cleaning files created in ".."
                    await mkdir(path.join(tmpdir, 'subdir', 'subsubdir'))
                    const oldPromptPath = path.join(tmpdir, 'subdir', 'prompt.md')
                    await writeFile(oldPromptPath, 'Old content')

                    // Act
                    const promptModification = await savePrompt(
                        promptName,
                        'New content',
                        oldPromptPath,
                        path.join(tmpdir, 'subdir'),
                        UNMOCKED_FILETOOLS
                    )

                    // Assert
                    const newPromptPath = path.join(tmpdir, 'subdir', `${promptName}.md`)
                    expect(promptModification.success).toBeFalsy()
                    expect(existsSync(oldPromptPath)).toBeTruthy()
                    expect((await readFile(oldPromptPath)).toString()).toBe('Old content')
                    expect(existsSync(newPromptPath)).toBeFalsy()
                    expect(
                        (
                            (await listFiles(path.join(tmpdir, 'subdir'))) as {
                                success: true
                                result: string[]
                            }
                        ).result
                    ).toStrictEqual([oldPromptPath])
                }
            )
        }
    )

    describe.each([FILETOOLS_WTIH_FAILING_RENAME, FILETOOLS_WTIH_FAILING_WRITE])(
        'with param: %s',
        (filetools) => {
            filesystemTest(
                'prompt file should not be renamed nor overriden when some operation failed',
                async ({ tmpdir }) => {
                    // Assert
                    const oldPromptPath = path.join(tmpdir, 'prompt.md')
                    await writeFile(oldPromptPath, 'Old content')

                    // Act
                    const promptModification = await savePrompt(
                        'new-name',
                        'New Content',
                        oldPromptPath,
                        tmpdir,
                        filetools
                    )

                    // Assert
                    const newPromptPath = path.join(tmpdir, 'new-name.md')
                    expect(promptModification.success).toBeFalsy()
                    expect(existsSync(newPromptPath)).toBeFalsy()
                    expect((await readFile(oldPromptPath)).toString()).toBe('Old content')
                    expect(
                        ((await listFiles(tmpdir)) as { success: true; result: string[] }).result
                    ).toStrictEqual([oldPromptPath])
                }
            )
        }
    )
})

const UNMOCKED_FILETOOLS = {
    delete: deleteFiles,
    rename: renameFile,
    write: writeTextFile
}
const FILETOOLS_WTIH_FAILING_RENAME = {
    delete: deleteFiles,
    rename: async (
        _filePath: string,
        _newName: string
    ): Promise<{ success: true; result: undefined } | { success: false; error: Error }> =>
        new Promise((resolve) => resolve({ success: false, error: new Error() })),
    write: writeTextFile
}
const FILETOOLS_WTIH_FAILING_WRITE = {
    delete: deleteFiles,
    rename: renameFile,
    write: async (
        _path: string,
        _content?: string
    ): Promise<{ success: true; result: undefined } | { success: false; error: Error }> =>
        new Promise((resolve) => resolve({ success: false, error: new Error() }))
}
