import Button from './Button'
import { ButtonColor, ButtonShape } from './props/ButtonProps'
import { TextFieldStyle } from './props/TextFieldProps'
import Text from './Text'
import TextField from './TextField'
import '../assets/components/FormItem.css'
import { TextSize, TextType } from './props/TextProps'
import { FormItemProps } from './props/FormItemProps'
import React from 'react'

/**
 * Component that contains text field, label, descriptioon and a few helper buttons. Should be used inside the forms.
 *
 * ### Value
 *
 * Text field value should be controlled by the parent component via the `value` props. Each time the value changes the
 * `onChange` callback is fired.
 *
 * The value can be optionally validated by the `validation()` function passed in props.
 *
 * ### Helper buttons
 *
 * Component contains 2 buttons: "restore default" and "clear".
 *
 * - **Restore default:** Invokes `onChange()` callback that restores default value for the input.
 * - **Clear:** Invokes `onChange()` callback that clears value for the input.
 *
 * ### Label & Description
 *
 * Container always contains a label for the text field. Also, if `description` component is passed then its description
 * is visible.
 */
const FormItem: React.FunctionComponent<FormItemProps> = ({
    value,
    label,
    defaultValue = '',
    description = undefined,
    lines = 1,
    onChange = () => {},
    validationStrategy = undefined,
    inputSupportingText = ''
}: FormItemProps) => {
    return (
        <div className="form-item-container">
            <div className="form-item-header-container">
                <Text type={TextType.headline} size={TextSize.small}>
                    {label}
                </Text>
                <div className="form-item-header-buttons-container">
                    <Button
                        label="Restore default"
                        shape={ButtonShape.square}
                        color={ButtonColor.outlined}
                        onClick={() =>
                            onChange({
                                target: { value: defaultValue }
                            } as React.ChangeEvent<HTMLInputElement>)
                        }
                    />
                    <Button
                        label="Clear"
                        color={ButtonColor.filledError}
                        icon_name="cancel"
                        shape={ButtonShape.square}
                        onClick={() =>
                            onChange({
                                target: { value: '' }
                            } as React.ChangeEvent<HTMLInputElement>)
                        }
                    />
                </div>
            </div>
            {description && <Text>{description}</Text>}
            <TextField
                label={label}
                style={TextFieldStyle.filled}
                value={value}
                lines={lines}
                onChange={onChange}
                validationStrategy={validationStrategy}
                supportingText={inputSupportingText}
            />
        </div>
    )
}

export default FormItem
