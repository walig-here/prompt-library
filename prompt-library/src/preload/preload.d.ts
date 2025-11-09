import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
    interface PromptsAPI {
        /**
         * Loads prompt from file with given path.
         *
         * @param path Prompt file path relative to user's data directory.
         * @returns Contents of the file (prompt) or error when loading failed.
         */
        loadFromFile: (path: string) => Promise<Result<string>>

        /**
         * Lists prompts' files (absolute) paths from user's data directory.
         */
        listPrompts: () => Promise<Result<string[]>>

        /**
         * Returns prompt's title.
         *
         * @param path Path to prompt's file.
         * @returns Prompt's title.
         */
        promptTitle: (path: string) => Promise<string>

        /**
         * Deletes prompt file.
         * @param path Prompt file path relative to user's data directory.
         * @returns Either the operation failed or succeeded.
         */
        deletePrompt: (path: string) => Promise<Result<undefined>>
    }

    interface Window {
        electron: ElectronAPI
        prompts: PromptsAPI
    }
}
