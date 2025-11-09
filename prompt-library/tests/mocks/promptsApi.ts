import { vi } from 'vitest'

export interface UserDataEntryMock {
    title: string
    content: string
}

export class PromptsApiMocker {
    private started: boolean = false
    private userData: Map<string, UserDataEntryMock> = new Map()

    public start(): PromptsAPI {
        this.started = true
        const mock: PromptsAPI = {
            loadFromFile: (path) => {
                if (this.userData.has(path))
                    return new Promise((resolve) =>
                        resolve({
                            success: true,
                            result: this.userData.get(path)?.content as string
                        })
                    )
                return new Promise((resolve) =>
                    resolve({ success: false, error: new Error('Not existing file!') })
                )
            },
            listPrompts: () => {
                const listedFile = this.userData.keys().toArray()
                return new Promise((resolve) => resolve({ success: true, result: listedFile }))
            },
            promptTitle: (path) => {
                if (this.userData.has(path))
                    return new Promise((resolve) =>
                        resolve(this.userData.get(path)?.title as string)
                    )
                throw Error('Not existing entry!')
            },
            deletePrompt: (path) => {
                if (!this.userData.delete(path))
                    return new Promise((resolve) =>
                        resolve({ success: false, error: Error('Cant remove. Not existing file!') })
                    )
                return new Promise((resolve) => resolve({ success: true, result: undefined }))
            }
        }

        vi.stubGlobal('prompts', mock)
        return mock
    }

    public reset(): void {
        this.started = false
        this.userData = new Map()
        vi.unstubAllGlobals()
    }

    public setUserData(newUserData: Map<string, UserDataEntryMock>): void {
        if (!this.started) throw Error('PromptsApi mock is not started!')
        this.userData = new Map(newUserData)
    }
}
