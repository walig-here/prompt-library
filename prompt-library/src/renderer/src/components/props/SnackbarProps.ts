import React from 'react'

export interface SnackbarProps {
    message: string
    onClosed?: React.MouseEventHandler<HTMLButtonElement>
    actionButton?: SnackbarActionButton
}

export interface SnackbarActionButton {
    label: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}
