import React from 'react'
import { TextFieldValidationResult } from './TextFieldProps'

export interface FormItemProps {
    value: string
    label: string
    defaultValue?: string
    description?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    lines?: number
    validationStrategy?: (string) => TextFieldValidationResult
    inputSupportingText?: string
}
