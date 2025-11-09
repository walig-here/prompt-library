import { ipcMain } from 'electron'
import path from 'path'
import { deleteFiles as deleteFile, listFiles, readTextFile } from './io'
import { PromptApiChannel } from '../common/promptsApi'

export function definePromptApiHandlers(): void {
    ipcMain.handle(PromptApiChannel.LOAD_PROMPT, (_, path) => readTextFile(path as string))
    ipcMain.handle(PromptApiChannel.LIST_PTOMPTS, () => listFiles('/home/workspace/prompts'))
    ipcMain.handle(
        PromptApiChannel.GET_PROMPT_TITLE,
        (_, promptPath) => path.basename(promptPath as string).split('.')[0]
    )
    ipcMain.handle(PromptApiChannel.DELETE_PROMPT, (_, path) => deleteFile(path as string))
}
