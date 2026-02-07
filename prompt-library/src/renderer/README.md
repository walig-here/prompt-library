# The User Interface

- [The User Interface](#the-user-interface)
  - [Screens](#screens)
    - [Prompt list](#prompt-list)
    - [Prompt editor](#prompt-editor)
    - [Fill prompt](#fill-prompt)
  - [Routing](#routing)

## Screens

### Prompt list 

Implemented in [`PromptList.tsx`](/prompt-library/src/renderer/src/screens/PromptList.tsx). Follows the state machine diagram presented below:

![state transitions in prompt list screen](/docs/img/ui/prompt-list.drawio.svg)

> **Previews:**
> [*Prompt list screen in the list mode*](/docs/img/ui/mock-prompts-list-browsing-mode.pdf); 
> [*Prompt list screen in the select mode*](/docs/img/ui/mock-prompts-list-selection-mode.pdf)

### Prompt editor

Implemented in [`PromptEditor.tsx`](/prompt-library/src/renderer/src/screens/PromptEditor.tsx). Follows the state machine diagram presented below:

![state transitions in prompt editor screen](/docs/img/ui/prompt-editor.drawio.svg)

> **Previews:**
> [*Prompt edit screen*](/docs/img/ui/mock-prompt-editor.pdf)

### Fill prompt

Implemented in [`PromptFill.tsx`](/prompt-library/src/renderer/src/screens/PromptFill.tsx)

> **Previews:**
> [*Fill prompt screen*](/docs/img/ui/mock-prompt-template-fill.pdf)

## Routing

![](/docs/img/ui/ui-routing.drawio.svg)

## Local OS I/O

User interface modules never performs the local I/O operations directly (network I/O is managed within the UI) due to security model of the *Electron.js*. They call the [`prompts` API](/prompt-library/src/preload/index.ts) exposed via the *Electron's* inter-process communication (IPC) when dealing with the local OS. This API is available as a property of the `window` global object.

*Example: Using `prompts` API to list all prompts saved in user's files.*
```ts
const promtListing = await window.prompts.listPrompts()
```
