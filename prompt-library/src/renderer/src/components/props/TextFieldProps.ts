import React, { ChangeEventHandler } from 'react'

export interface TextFieldProps {
    type?: TextFieldType
    style: TextFieldStyle
    label: string
    value: string
    prefix?: string
    suffix?: string
    lines?: number
    disabled?: boolean
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    validationStrategy?: (string) => TextFieldValidationResult
    supportingText?: string
    leadingIcon?: TextFieldIcon
    trailingIcon?: TextFieldIcon
}

export type TextFieldValidationResult = { success: false; reason: string } | { success: true }

export interface TextFieldIcon {
    iconName: string
    onClick?: React.MouseEventHandler
}

export enum TextFieldType {
    text = 'text',
    password = 'password',
    email = 'email',
    number = 'number',
    url = 'url'
}

export enum TextFieldStyle {
    filled = 'filled',
    outlined = 'outlined'
}
