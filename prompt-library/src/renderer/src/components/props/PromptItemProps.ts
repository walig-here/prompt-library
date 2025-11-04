import React from 'react'

export interface PromptListItemProps {
    title: string
    promptFilePath: string
    mode: PromptListItemMode
    onSelectionChanged?: React.ChangeEventHandler<HTMLInputElement>
    onClick?: (promptFilePatt: string) => void
    onEditClick?: (promtFilePath: string) => void
    onRemoveClick?: (promptFilePath: string) => void
}

export enum PromptListItemMode {
    SELECTED = 'prompt-list-item-selected',
    DESELECTED = 'prompt-list-item-deselected',
    SELECTABLE = 'prompt-list-item-selectable'
}
