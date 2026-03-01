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

        /**
         * Saves changes made to the prompt.
         *
         * Depending on the `path` param it overrides existing prompt or creates a new one.
         *
         * This is a transatcion. Both title and content saving must end with success or any changes would be rolled
         * back otherwise.
         *
         * @param title Title of the new prompt. Must be a valid filename and unique among all existing prompts.
         * @param content Content of the prompt.
         * @param path Path to the prompt file. Default to null for new prompts that don't have prompt file yet.
         * @returns Either the operation failed or succeeded.
         */
        savePrompt: (
            title: string,
            content: string,
            path: string | null = null
        ) => Promise<Result<undefined>>
    }

    interface Window {
        electron: ElectronAPI
        prompts: PromptsAPI
    }
}
