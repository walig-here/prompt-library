import { describe, expect } from 'vitest'
import { filesystemTest } from '../../fixtures/fixtures'
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
    deleteFiles as deleteFile,
    listFiles,
    readTextFile,
    renameFile,
    writeTextFile
} from '../../../src/main/io'
import { existsSync, statSync } from 'node:fs'

describe('deleting files', () => {
    filesystemTest(
        'file should be deleted when it exists and has its path passed',
        async ({ tmpdir }) => {
            // Arrange
            const filePath = path.join(tmpdir, 'file.txt')
            await writeFile(filePath, '')

            // Act
            const fileDeletion = await deleteFile(filePath)

            // Assert
            expect(fileDeletion.success).toBeTruthy()
            expect(existsSync(filePath)).toBeFalsy()
        }
    )

    filesystemTest(
        'no files should be deleted when path to non-existing file is passed',
        async ({ tmpdir }) => {
            // Arrange
            const filePath = path.join(tmpdir, 'file.txt')

            // Act
            const fileDeletion = await deleteFile(filePath)

            // Assert
            expect(fileDeletion.success).toBeFalsy()
        }
    )

    filesystemTest(
        'no files should be deleted when path to directory is passed',
        async ({ tmpdir }) => {
            // Arrange
            const dirPath = path.join(tmpdir, 'dir')
            await mkdir(dirPath)

            // Act
            const fileDeletion = await deleteFile(dirPath)

            // Assert
            expect(fileDeletion.success).toBeFalsy()
            expect(existsSync(dirPath)).toBeTruthy()
        }
    )

    filesystemTest(
        'no files should be deleted when file has no edit rights',
        async ({ tmpdir }) => {
            // Arrange
            const filePath = path.join(tmpdir, 'file.txt')
            await writeFile(filePath, '')
            await chmod(tmpdir, 0o400)

            // Act
            const fileDeletion = await deleteFile(filePath)

            // Assert
            expect(fileDeletion.success).toBeFalsy()
            await chmod(tmpdir, 0o777)
            expect(existsSync(filePath)).toBeTruthy()
        }
    )
})

describe('reading from file', () => {
    filesystemTest(
        'all contents should be loaded when file exists and is not empty',
        async ({ tmpdir }) => {
            const FILE_CONTENTS = 'I really like peaches!\nPeaches are sooooo tasty...'
            const filePath = path.join(tmpdir, 'testFile.txt')
            await writeFile(filePath, FILE_CONTENTS)

            const loadedData = await readTextFile(filePath)

            expect(loadedData.success).toBeTruthy()
            expect((loadedData as SuccessResult<string>).result).toBe(FILE_CONTENTS)
        }
    )

    filesystemTest(
        'empty string should be loaded when file exists and is empty',
        async ({ tmpdir }) => {
            const filePath = path.join(tmpdir, 'testFile.txt')
            await writeFile(filePath, '')

            const loadedData = await readTextFile(filePath)

            expect(loadedData.success).toBeTruthy()
            expect((loadedData as SuccessResult<string>).result).toBe('')
        }
    )

    filesystemTest('error should be returned when file does not exist', async () => {
        const loadedData = await readTextFile('non-eixsting-file.txt')

        expect(loadedData.success).toBeFalsy()
        expect('error' in loadedData).toBeTruthy()
    })

    filesystemTest(
        'error should be returned when provided path points to a directory',
        async ({ tmpdir }) => {
            const dirPath = path.join(tmpdir, 'testDir')
            await mkdir(dirPath)

            const loadedData = await readTextFile(dirPath)

            expect(loadedData.success).toBeFalsy()
            expect('error' in loadedData).toBeTruthy()
        }
    )

    filesystemTest(
        'error should be returned when file permission does not allow reading',
        async ({ tmpdir }) => {
            const filePath = path.join(tmpdir, 'testFile.txt')
            await writeFile(filePath, '')
            await chmod(filePath, 0o000)

            const loadedData = await readTextFile(filePath)

            expect(loadedData.success).toBeFalsy()
            expect('error' in loadedData).toBeTruthy()
        }
    )
})

describe('listing directory', () => {
    filesystemTest(
        'relative paths to files only should be listed when path to not empty directory is passed',
        async ({ tmpdir }) => {
            const testDirPath = path.join(tmpdir, 'testDir')
            await mkdir(testDirPath)
            const subdirPath = path.join(testDirPath, 'subdir')
            await mkdir(subdirPath)
            const file1Path = path.join(testDirPath, 'file1.txt')
            await writeFile(file1Path, '')
            const file2Path = path.join(testDirPath, 'file2.txt')
            await writeFile(file2Path, '')
            const subdirFilePaht = path.join(subdirPath, 'file3.txt')
            await writeFile(subdirFilePaht, '')

            const fileListing = await listFiles(testDirPath)

            expect(fileListing.success).toBeTruthy()
            expect((fileListing as SuccessResult<string[]>).result).toStrictEqual([
                path.resolve(file1Path),
                path.resolve(file2Path)
            ])
        }
    )

    filesystemTest(
        'empty list should be returned when path to directory with only subdirectories is passed',
        async ({ tmpdir }) => {
            const testDirPath = path.join(tmpdir, 'testDir')
            await mkdir(testDirPath)
            const subdirPath = path.join(testDirPath, 'subdir')
            await mkdir(subdirPath)
            const subdirFilePaht = path.join(subdirPath, 'file1.txt')
            await writeFile(subdirFilePaht, '')

            const fileListing = await listFiles(testDirPath)

            expect(fileListing.success).toBeTruthy()
            expect((fileListing as SuccessResult<string[]>).result).toStrictEqual([])
        }
    )

    filesystemTest(
        'empty list should be returned when path to empty directory is passed',
        async ({ tmpdir }) => {
            const testDirPath = path.join(tmpdir, 'testDir')
            await mkdir(testDirPath)

            const fileListing = await listFiles(testDirPath)

            expect(fileListing.success).toBeTruthy()
            expect((fileListing as SuccessResult<string[]>).result).toStrictEqual([])
        }
    )

    filesystemTest('error should be returned when directory does not exists', async () => {
        const fileListing = await listFiles('non-existing-dir')

        expect(fileListing.success).toBeFalsy()
        expect('error' in fileListing).toBeTruthy()
    })

    filesystemTest(
        'error should be returned when path to normal file is passed',
        async ({ tmpdir }) => {
            const testFilePath = path.join(tmpdir, 'testDir')
            await writeFile(testFilePath, '')

            const fileListing = await listFiles(testFilePath)

            expect(fileListing.success).toBeFalsy()
            expect('error' in fileListing).toBeTruthy()
        }
    )
})

describe('write to text file', () => {
    describe.each(['', 'This is new file'])('with param: %s', (content) => {
        filesystemTest(
            'file with given path should be created when such file have not exist',
            async ({ tmpdir }) => {
                // Arrange
                const newFilePath = path.join(tmpdir, 'newFile.txt')

                // Act
                const fileWriting = await writeTextFile(newFilePath, content)

                // Assert
                const actualContent = await readFile(newFilePath)
                expect(fileWriting.success).toBeTruthy()
                expect(actualContent.toString()).toBe(content)
            }
        )
    })

    describe.each(['', 'This is new content of the file'])('', (content) => {
        filesystemTest(
            'file with given path should be overriden when it already exists',
            async ({ tmpdir }) => {
                // Arrange
                const newFilePath = path.join(tmpdir, 'newFile.txt')
                await writeFile(newFilePath, 'Old content')

                // Act
                const fileWriting = await writeTextFile(newFilePath, content)

                // Assert
                const actualContent = await readFile(newFilePath)
                expect(fileWriting.success).toBeTruthy()
                expect(actualContent.toString()).toBe(content)
            }
        )
    })

    describe.each(['', 'subdir/dir', '.', '..', '~/file.txt'])('with param: %s', (filePath) => {
        filesystemTest('no new file should be created when path is invalid', async ({ tmpdir }) => {
            // Arrange
            const newFilePath = path.join(tmpdir, filePath)

            // Act
            const fileWriting = await writeTextFile(newFilePath)

            // Assert
            expect(!existsSync(newFilePath) || !statSync(newFilePath).isFile()).toBeTruthy()
            expect(fileWriting.success).toBeFalsy()
        })
    })

    filesystemTest(
        'file with given path should not be overriden when user has no permission to modify it',
        async ({ tmpdir }) => {
            // Arrange
            const newFilePath = path.join(tmpdir, 'file.txt')
            await writeFile(newFilePath, 'Old content')
            await chmod(newFilePath, 0o444)

            // Act
            const fileWriting = await writeTextFile(newFilePath)

            // Assert
            await chmod(newFilePath, 0o777)
            expect(fileWriting.success).toBeFalsy()
            expect((await readFile(newFilePath)).toString()).toBe('Old content')
        }
    )

    filesystemTest(
        'file with given path should not be created when user has no permission to create files in directory',
        async ({ tmpdir }) => {
            // Arrange
            const newFilePath = path.join(tmpdir, 'file.txt')
            await chmod(tmpdir, 0o444)

            // Act
            const fileWriting = await writeTextFile(newFilePath)

            // Assert
            await chmod(tmpdir, 0o777)
            expect(fileWriting.success).toBeFalsy()
            expect(existsSync(newFilePath)).toBeFalsy()
        }
    )
})

describe('rename file', () => {
    filesystemTest('file should be renamed when it exists', async ({ tmpdir }) => {
        // Arrange
        const oldFilePath = path.join(tmpdir, 'file.txt')
        await writeFile(oldFilePath, 'Old content')

        // Act
        const renaming = await renameFile(oldFilePath, 'newName.txt')

        // Assert
        const newFilePath = path.join(path.dirname(oldFilePath), 'newName.txt')
        expect(renaming.success).toBeTruthy()
        expect(existsSync(oldFilePath)).toBeFalsy()
        expect((await readFile(newFilePath)).toString()).toBe('Old content')
    })

    describe.each(['', 'subsubdir/dir', '.', '..', '~/file.txt', '../newName'])(
        'with param: %s',
        (newName) => {
            filesystemTest('rename should fail when new name is invalid', async ({ tmpdir }) => {
                // Arrange
                await mkdir(path.join(tmpdir, 'subdir')) // to avoid writing to parent that aren't cleared by fixture
                await mkdir(path.join(tmpdir, 'subdir', 'subsubdir'))
                const oldFilePath = path.join(tmpdir, 'subdir', 'file.txt')
                await writeFile(oldFilePath, 'Old content')

                // Act
                const renaming = await renameFile(oldFilePath, newName)

                // Assert
                const newFilePath = path.join(path.dirname(oldFilePath), newName)
                expect(renaming.success).toBeFalsy()
                expect(existsSync(oldFilePath)).toBeTruthy()
                expect(!existsSync(newFilePath) || !statSync(newFilePath).isFile()).toBeTruthy()
            })
        }
    )

    filesystemTest(
        'rename should fail when user has no permission to rename file',
        async ({ tmpdir }) => {
            // Arrange
            const oldFilePath = path.join(tmpdir, 'file.txt')
            await writeFile(oldFilePath, 'Old content')
            await chmod(tmpdir, 0o444)

            // Act
            const renaming = await renameFile(oldFilePath, 'newName.txt')

            // Assert
            const newFilePath = path.join(path.dirname(oldFilePath), 'newName.txt')
            await chmod(tmpdir, 0o777)
            expect(renaming.success).toBeFalsy()
            expect(existsSync(oldFilePath)).toBeTruthy()
            expect(existsSync(newFilePath)).toBeFalsy()
        }
    )

    filesystemTest('rename should fail when file does not exist', async ({ tmpdir }) => {
        // Arrange
        const oldFilePath = path.join(tmpdir, 'file.txt')

        // Act
        const renaming = await renameFile(oldFilePath, 'newName.txt')

        // Assert
        const newFilePath = path.join(path.dirname(oldFilePath), 'newName.txt')
        expect(renaming.success).toBeFalsy()
        expect(existsSync(newFilePath)).toBeFalsy()
    })
})
