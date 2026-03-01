import React from 'react'

export interface DialogProps {
    iconName?: string
    headline?: string
    supportingText: string
    children?: React.ReactNode
    mainButton: DialogButtonProps
    secondaryButton?: DialogButtonProps
}

interface DialogButtonProps {
    label: string
    onClick: () => void
}
