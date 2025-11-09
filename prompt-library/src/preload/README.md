# Prompts API development

This document contain manuals for developing the *PromptsAPI*. This API allows for communication between the local OS managed by *Node.js* ([`main`](/prompt-library/src/main/)) and UI managed by *React.js* ([`renderer`](/prompt-library/src/renderer/)).

## Gloassary

- **Channel:** A tunnel with a uniqe name that allows for invoking one specific action in the OS-side in response for the signal sent from the UI-side.
- **Invoker:** Function called on the UI-side that sends signal to the OS-side via *channel*.
- **Handler:** Function called by the OS-side when signal from UI-side is detected in the *channel*.

## File structure

```
src
|-- main
|   |-- index.ts                # Handlers registration
|   `-- promptsApiHandlers.ts   # Handlers implementation
`-- preload
    |-- index.ts                # Invokers implementation
    `-- preload.d.ts            # Type definitions for the API
```

Declaration of all API actions and their corresponding channels is placed in the [`preload.d.ts`](/prompt-library/src/preload/preload.d.ts) file. Those actions are ment to be triggered by signals sent from the UI-side. Invoker function that send those signals are implemented in the [`preload/index.ts`](/prompt-library/src/preload/index.ts) file. Signals are meant to be hanlded on the OS-side in by the handler functions defined [`main/promptsApiHandlers.ts`](/prompt-library/src/main/promptsApiHandlers.ts) file. This handlers need to be registered so that the OS-side starts listening for signals. This registration is perfomred in the [`main/index.ts`](/prompt-library/src/main/index.ts) file.

## Manuals

### How to add new action to API?

1. In [`preload.d.ts`](/prompt-library/src/preload/preload.d.ts) file create new function definition inside the `PromptsAPI` interface. This function would represent your new action.

    ```ts
    // preload.d.ts
    interface PromptsAPI {
        loadFromFile: (path: string) => Promise<Result<string>>
    }
    ```

2. In the same file add new entry to the `PromptsApiChannels` enum. This would be an identifier for your action's *channel*.

    ```ts
    // preload.d.ts
    enum PromptApiChannel {
        LOAD_PROMPT = 'prompt:load',
    }
    ```

3. In the [`preload/index.ts`](/prompt-library/src/preload/index.ts) add implementation for *invoker* function within the `proimptsAPI` object. It must have the same name, return type and parameters as the function previously defined in the `preload.d.ts` file. The only thing it should do is invoking signal on the previously defined channel in a way shown in the exaple below.

    ```ts
    // preload/index.ts
    const promptsAPI = {
        loadFromFile: (path: string) => ipcRenderer.invoke(PromptApiChannel.LOAD_PROMPT, path),
    }
    ```

4. In the [`main/promptsApiHandlers.ts`](/prompt-library/src/main/promptsApiHandlers.ts) add implemendation for the *hanlder* function inside the `definePromptApiHandlers()` function. Hanlder funtion should be put inside parameter of the `ipcMain.handle()` call as shown in the exaple below.

    ```ts
    // main/promptsApiHandler.ts
    export function definePromptApiHandlers(): void {
        ipcMain.handle(
            PromptApiChannel.LOAD_PROMPT,               // Channel
            (_, path) => readTextFile(path as string)   // Hanlder function
        )
    }
    ```

### How are handlers registered on the OS-side?

They are registred by calling the `definePrompApiHandlers()` inside the `whenReady()` callback of the [`main/index.ts`](/prompt-library/src/main/index.ts) file.
