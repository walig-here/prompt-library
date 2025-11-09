import { readdir, readFile, rm } from 'fs/promises'
import { lstatSync } from 'fs'
import path from 'path'
import { ensureError } from '../common/exceptions'

/**
 * Reads text file from local filesystem.
 * @param path Path to read file.
 * @returns All contents of the file or error when file can't be read.
 */
export async function readTextFile(path: string): Promise<Result<string>> {
    try {
        return {
            success: true,
            result: (await readFile(path)).toString()
        }
    } catch (thrownValue: unknown) {
        const error = ensureError(thrownValue)
        return { success: false, error: error }
    }
}

/**
 * Lists all files from directory within local filesystem (non-recursive).
 * @param directoryPath Path to listed directory.
 * @returns List of absolute paths to all files from directory or error when files can't be listed.
 */
export async function listFiles(directoryPath: string): Promise<Result<string[]>> {
    try {
        const isFile = (path: string): boolean => lstatSync(path).isFile()

        return {
            success: true,
            result: (await readdir(directoryPath, { recursive: false }))
                .map((file) => path.resolve(path.join(directoryPath, file)))
                .filter(isFile)
        }
    } catch (thrownValue) {
        const error = ensureError(thrownValue)
        return { success: false, error: error }
    }
}

/**
 * Deletes given file.
 *
 * @param path Path to files that is going to be deleted.
 * @returns Nothing on success or error when file can't be deleted.
 */
export async function deleteFiles(path: string): Promise<Result<undefined>> {
    try {
        await rm(path)
    } catch (thrownValue) {
        const error = ensureError(thrownValue)
        return { success: false, error: error }
    }
    return { success: true, result: undefined }
}
