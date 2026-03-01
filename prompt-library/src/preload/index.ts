import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { PromptApiChannel } from '../common/promptsApi'

const promptsAPI = {
    loadFromFile: (path: string) => ipcRenderer.invoke(PromptApiChannel.LOAD_PROMPT, path),
    listPrompts: () => ipcRenderer.invoke(PromptApiChannel.LIST_PTOMPTS),
    promptTitle: (path: string) => ipcRenderer.invoke(PromptApiChannel.GET_PROMPT_TITLE, path),
    deletePrompt: (path: string) => ipcRenderer.invoke(PromptApiChannel.DELETE_PROMPT, path),
    savePrompt: (title: string, content: string, path: string | null = null) =>
        ipcRenderer.invoke(PromptApiChannel.SAVE_PROMPT, title, content, path)
}

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('prompts', promptsAPI)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.prompts = promptsAPI
}
