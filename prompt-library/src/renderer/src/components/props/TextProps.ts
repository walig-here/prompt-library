import React from 'react'

export interface TextProps {
    children: React.ReactNode
    type?: TextType
    size?: TextSize
    isEmphasized?: boolean
    isSerif?: boolean
    color?: TextColor
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

export enum TextColor {
    default = '',
    variant = 'md-text-color-variant',
    error = 'md-text-color-error',
    primary = 'md-text-color-primary',
    secondary = 'md-text-color-secondary'
}
