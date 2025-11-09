import React from 'react'

export interface SearchBarProps {
    query: string
    onChanged: React.ChangeEventHandler<HTMLInputElement>
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
