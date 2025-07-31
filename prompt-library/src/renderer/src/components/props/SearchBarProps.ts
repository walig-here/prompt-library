import React from 'react'

export interface SearchBarProps<T> {
    collection: T[]
    onSearched: (result: T[]) => void
    searchStrategy: (query: string, collection: T[]) => T[]
    onLeadingIconClicked?: React.MouseEventHandler<HTMLButtonElement>
    avatar?: SearchBarAvatar
    firstTrailingIcon?: SearchBarTrainilngIcon
    secondTrailingIcon?: SearchBarTrainilngIcon
    placeholder?: string
}

export interface SearchBarTrainilngIcon {
    iconName: string
    onIconClicked?: React.MouseEventHandler<HTMLButtonElement>
}

export interface SearchBarAvatar {
    uri: string
    onAvatarClicked?: React.MouseEventHandler<HTMLElement>
}
