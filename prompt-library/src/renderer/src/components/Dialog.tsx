import React, { useEffect, useRef } from 'react'
import { DialogProps } from './props/DialogProps'
import Icon from './Icon'
import Button from './Button'
import '../assets/components/Dialog.css'
import { ButtonColor, ButtonSize } from './props/ButtonProps'
import Text from './Text'
import { TextColor, TextSize, TextType } from './props/TextProps'

/**
 * Basic dialog that follows Material Design 3 principles.
 *
 * Specs: https://m3.material.io/components/dialogs/specs
 *
 * ### Usage
 *
 * Just put this component in JSX of its parent. When visible, the dialog would be placed on top of the current content
 * with the dim overlay. You should control the visibility of the dialog yourself (with the conditional rendering for
 * example).
 *
 * State of the dialog is meant to be stored within its parent component and changed by the callbacks of the dialog's
 * `children` components (that could be various inputs: dropdowns, radio buttons, text inputs and so on) or its buttons.
 *
 * ### Buttons
 *
 * By default the dialog would always contain at least one button (main button). It could also render the additional
 * button when its data is provided in `secondaryButton` props.
 */
const Dialog: React.FunctionComponent<DialogProps> = ({
    mainButton,
    supportingText,
    children,
    headline,
    iconName,
    secondaryButton
}: DialogProps) => {
    const dialog: React.Ref<HTMLDialogElement | null> = useRef(null)

    useEffect(() => {
        if (dialog.current === null) return
        dialog.current.showModal()
    }, [])

    return (
        <dialog ref={dialog} className="md-dialog">
            <div className="md-dialog-header">
                {iconName && <Icon name={iconName} size={24} />}
                <Text size={TextSize.small} type={TextType.headline}>
                    {headline}
                </Text>
                <Text size={TextSize.medium} color={TextColor.variant}>
                    {supportingText}
                </Text>
            </div>
            <div>{children}</div>
            <div className="md-dialog-buttons-container">
                <Button
                    label={mainButton.label}
                    onClick={mainButton.onClick}
                    color={ButtonColor.text}
                    size={ButtonSize.small}
                />
                {secondaryButton && (
                    <Button
                        label={secondaryButton.label}
                        onClick={secondaryButton.onClick}
                        color={ButtonColor.text}
                        size={ButtonSize.small}
                    />
                )}
            </div>
        </dialog>
    )
}

export default Dialog
