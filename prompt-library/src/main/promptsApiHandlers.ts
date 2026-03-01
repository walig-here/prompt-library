import { app, ipcMain } from 'electron'
import path from 'path'
import { deleteFiles as deleteFile, listFiles, readTextFile, renameFile, writeTextFile } from './io'
import { PromptApiChannel } from '../common/promptsApi'
import { existsSync, mkdirSync } from 'fs'

export function definePromptApiHandlers(): void {
    let user_data_dir = process.env.USER_DATA_DIR
    if (user_data_dir === undefined) {
        user_data_dir = path.join(app.getPath('documents'), 'Prompt Library')
        if (!existsSync(user_data_dir)) {
            console.info(`Created user data directory`, { path: user_data_dir })
            mkdirSync(user_data_dir)
        }

        console.info('Set user data directory', { path: user_data_dir })
    }

    ipcMain.handle(PromptApiChannel.LOAD_PROMPT, (_, path) => readTextFile(path as string))
    ipcMain.handle(PromptApiChannel.LIST_PTOMPTS, () => listPrompts(user_data_dir))
    ipcMain.handle(
        PromptApiChannel.GET_PROMPT_TITLE,
        (_, promptPath) => path.basename(promptPath as string).split('.')[0]
    )
    ipcMain.handle(PromptApiChannel.DELETE_PROMPT, (_, path) => deleteFile(path as string))
    ipcMain.handle(
        PromptApiChannel.SAVE_PROMPT,
        (_, title: string, content: string, promptPath: string | null = null) =>
            savePrompt(title, content, promptPath, user_data_dir, {
                delete: deleteFile,
                rename: renameFile,
                write: writeTextFile
            })
    )
}

export async function listPrompts(userDataDir: string): Promise<Result<string[]>> {
    return listFiles(userDataDir)
}

/**
 * Saves changes made to the prompt.
 *
 * Depending on the `promptPath` param it overrides existing prompt or creates a new one.
 *
 * This is a transatcion. Both title and content saving must end with success or any changes would be rolled
 * back otherwise.
 *
 * @param title Title of the new prompt. Must be a valid filename and unique among all existing prompts.
 * @param content Content of the prompt.
 * @param promptPath Path to the prompt file. Default to null for new prompts that don't have prompt file yet.
 * @param userDataDir Path to directory where user's prompts are stored.
 * @param filetools Toolset for filesystem operations.
 * @returns Either the operation failed or succeeded.
 */
export async function savePrompt(
    title: string,
    content: string,
    promptPath: string | null,
    userDataDir: string,
    filetools: {
        rename: (filePath: string, newName: string) => Promise<Result<undefined>>
        write: (path: string, content: string) => Promise<Result<undefined>>
        delete: (path: string) => Promise<Result<undefined>>
    }
): Promise<Result<undefined>> {
    // Enforce name validity
    const updatedFilePath = path.join(userDataDir, `${title}.md`)
    if (title === '' || !path.matchesGlob(updatedFilePath, `${userDataDir}/*`))
        return { success: false, error: new Error(`Prompt name contains prohibited characters!`) }

    // Enforce name uniqueness
    if (updatedFilePath !== promptPath) {
        const promptsPathsLoading = await listPrompts(userDataDir)
        if (!promptsPathsLoading.success) return promptsPathsLoading
        if (
            promptsPathsLoading.result
                .filter((path) => path !== promptPath)
                .includes(updatedFilePath)
        )
            return { success: false, error: new Error('Prompt name is not unique') }
    }

    // Create backup
    const backupFilePath =
        promptPath === null
            ? promptPath
            : path.join(userDataDir, `${path.basename(promptPath)}.bck`)
    if (backupFilePath !== null) {
        const renameOldFile = await filetools.rename(
            promptPath as string,
            path.basename(backupFilePath)
        )
        if (!renameOldFile.success) return renameOldFile
    }

    // Create file with updated content
    const creatingUpdatedFile = await filetools.write(updatedFilePath, content)
    if (!creatingUpdatedFile.success) {
        if (promptPath !== null)
            await filetools.rename(backupFilePath as string, path.basename(promptPath))
        return creatingUpdatedFile
    }

    // Delete backup
    if (backupFilePath !== null) await filetools.delete(backupFilePath)

    // End
    return { success: true, result: undefined }
}
