import React, { useState } from 'react'
import IconButton from './IconButton'
import { ButtonSize, IconButtonColor } from './props/ButtonProps'
import {
    TextFieldIcon,
    TextFieldProps,
    TextFieldStyle,
    TextFieldType,
    TextFieldValidationResult
} from './props/TextFieldProps'
import Text from './Text'
import '../assets/components/TextField.css'
import { TextColor, TextSize, TextType } from './props/TextProps'

/**
 * Text input field compliant with the Material Design 3 principles. Can be single-line or multiline (controlled with
 * `multiline` prop).
 *
 * Specs: https://m3.material.io/components/text-fields/specs
 *
 * ### Input value
 *
 * Input value is controlled by parent and passed via the `value` prop. Additionaly `suffix` and `prefix` values are
 * going to be rendered along the value when they are passed.
 *
 * When `validationStrategy()` is passed then its run againts `value` on render. This way component determines if the
 * input value is correct. If not, then component enters its error state.
 *
 * ### Handling user input
 *
 * The `onChange()` callback passed in props would be called each time user changes value in the input.
 */
const TextField: React.FunctionComponent<TextFieldProps> = ({
    label,
    supportingText,
    style,
    value,
    disabled = false,
    prefix = undefined,
    suffix = undefined,
    type = TextFieldType.text,
    lines = 1,
    onChange = () => {},
    validationStrategy = undefined,
    leadingIcon = undefined,
    trailingIcon = undefined
}: TextFieldProps) => {
    const [focused, setFocused] = useState(false)

    const validationResult: TextFieldValidationResult = validationStrategy
        ? validationStrategy(value)
        : { success: true }
    const trailingIconComponent = (
        <_TextFieldTrailingIcon
            disabled={disabled}
            error={!validationResult.success}
            value={value}
            trailingIconData={trailingIcon}
        />
    )
    const supportingTextComponent = (
        <_TextFieldSupportingText
            disabled={disabled}
            validationResult={validationResult}
            value={supportingText}
        />
    )

    return (
        <div>
            <div
                className={_getContainerStyle(
                    style,
                    disabled,
                    lines,
                    focused,
                    !validationResult.success
                )}
            >
                <div className={_getLedingComponentsStyle(lines)}>
                    {leadingIcon && (
                        <IconButton
                            iconName={leadingIcon.iconName}
                            onClick={leadingIcon.onClick}
                            disabled={disabled}
                            color={IconButtonColor.standard}
                            size={ButtonSize.extraSmall}
                        />
                    )}
                    <div className="md-text-area-input-components">
                        {value !== '' && (
                            <div className={_getLabelStyle(style)}>
                                <Text
                                    size={TextSize.small}
                                    type={TextType.body}
                                    color={_getLabelColor(
                                        focused,
                                        !validationResult.success,
                                        disabled
                                    )}
                                >
                                    {label}
                                </Text>
                            </div>
                        )}
                        <div className="md-text-area-text">
                            {prefix && value && <Text>{prefix}</Text>}
                            <_TextFieldInput
                                disabled={disabled}
                                label={label}
                                lines={lines}
                                onBlur={() => setFocused(false)}
                                onFocus={() => setFocused(true)}
                                type={type}
                                value={value}
                                onChange={onChange}
                                focused={focused}
                                error={!validationResult.success}
                            />
                            {suffix && value && <Text>{suffix}</Text>}
                        </div>
                    </div>
                </div>
                {trailingIconComponent && trailingIconComponent}
            </div>
            {style === TextFieldStyle.filled && (
                <div
                    className={_getActiveIndicatorStyle(
                        disabled,
                        !validationResult.success,
                        focused
                    )}
                />
            )}
            <div className="md-text-area-supporting-text">
                {supportingTextComponent && supportingTextComponent}
            </div>
        </div>
    )
}

export default TextField

/* SUBCOMPONENTS */

interface _TextFieldSupportingTextProps {
    validationResult: TextFieldValidationResult
    value?: string
    disabled: boolean
}

const _TextFieldSupportingText:
    | React.FunctionComponent<_TextFieldSupportingTextProps>
    | ((_TextFieldSupportingTextProps) => null) = ({
    validationResult,
    value,
    disabled
}: _TextFieldSupportingTextProps) => {
    if (!validationResult.success) {
        return (
            <Text size={TextSize.small} type={TextType.body} color={TextColor.error}>
                {validationResult.reason}
            </Text>
        )
    } else if (value) {
        return (
            <Text
                size={TextSize.small}
                type={TextType.body}
                color={!disabled ? TextColor.variant : TextColor.default}
            >
                {value}
            </Text>
        )
    }
    return null
}

interface _TextFieldTrailingIconProps {
    error: boolean
    disabled: boolean
    trailingIconData?: TextFieldIcon
    value: string
}

const _TextFieldTrailingIcon:
    | React.FunctionComponent<_TextFieldTrailingIconProps>
    | ((_TextFieldTrailingIconProps) => null) = ({
    error,
    disabled,
    trailingIconData,
    value
}: _TextFieldTrailingIconProps) => {
    if (error) {
        return (
            <IconButton
                iconName="error"
                color={IconButtonColor.standardError}
                disabled={disabled}
                size={ButtonSize.extraSmall}
            />
        )
    } else if (value && trailingIconData) {
        return (
            <IconButton
                iconName={trailingIconData.iconName}
                onClick={trailingIconData.onClick}
                disabled={disabled}
                color={IconButtonColor.standard}
                size={ButtonSize.extraSmall}
            />
        )
    }
    return null
}

interface _TextFieldInputProps {
    lines: number
    type: TextFieldType
    value: string
    disabled: boolean
    label: string
    error: boolean
    focused: boolean
    onFocus: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

const _TextFieldInput: React.FunctionComponent<_TextFieldInputProps> = ({
    lines,
    type,
    value,
    disabled,
    onChange = () => {},
    label,
    onFocus,
    onBlur,
    error,
    focused
}: _TextFieldInputProps) => {
    return lines > 1 && type === TextFieldType.text ? (
        <textarea
            value={value}
            disabled={disabled}
            onChange={onChange}
            className={_getInputStyle(lines, error, focused)}
            placeholder={label}
            rows={lines}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    ) : (
        <input
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            type={type.valueOf()}
            value={value}
            disabled={disabled}
            className={_getInputStyle(lines, error, focused)}
            placeholder={label}
        />
    )
}

/* STYLES */

const _getActiveIndicatorStyle = (disabled: boolean, error: boolean, focused: boolean): string => {
    if (disabled) return 'md-text-area-active-indicator-disabled'
    if (error && focused) return 'md-text-area-active-indicator-error'
    if (focused) return 'md-text-area-active-indicator-active'
    return 'md-text-area-active-indicator'
}

const _getLabelColor = (focused: boolean, error: boolean, disabled: boolean): TextColor => {
    if (disabled) return TextColor.default
    if (error) return TextColor.error
    if (focused) return TextColor.primary
    return TextColor.variant
}

const _getLabelStyle = (style: TextFieldStyle): string => {
    return style === TextFieldStyle.outlined ? 'md-text-area-label-outlined' : ''
}

const _getInputStyle = (lines: number, error: boolean, focused: boolean): string => {
    let inputStyle = `md-text-area-input${lines > 1 ? ' md-text-area-input-multiline' : ''}`
    if (!focused && error) inputStyle += ' md-text-area-input-error'
    return inputStyle
}

const _getContainerStyle = (
    style: TextFieldStyle,
    disabled: boolean,
    lines: number,
    focused: boolean,
    error: boolean
): string => {
    let containerAdditionalStyles =
        style === TextFieldStyle.filled
            ? 'md-text-field-container-filled'
            : 'md-text-field-container-outlined'
    if (style === TextFieldStyle.outlined) {
        if (focused) containerAdditionalStyles += '-focused'
        if (error) containerAdditionalStyles += ' md-text-area-label-outlined-error'
    }

    if (lines > 1) containerAdditionalStyles += ` md-text-field-container-multiline`

    if (disabled) containerAdditionalStyles += `-disabled`

    return `md-text-area-container ${containerAdditionalStyles}`
}

const _getLedingComponentsStyle = (lines: number): string => {
    return `md-text-area-leading-components${lines > 1 ? ' md-text-area-leading-components-multiline' : ''}`
}
