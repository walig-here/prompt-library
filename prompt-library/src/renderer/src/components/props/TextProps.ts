import React from 'react'

export interface TextProps {
    children: React.ReactNode
    type?: TextType
    size?: TextSize
    isEmphasized?: boolean
    isSerif?: boolean
}

export enum TextType {
    display = 'md-text-display',
    headline = 'md-text-headline',
    title = 'md-text-title',
    label = 'md-text-label',
    body = 'md-text-body'
}

export enum TextSize {
    large = 'large',
    medium = 'medium',
    small = 'small'
}
