import React, { useEffect } from 'react'
import { SnackbarProps } from './props/SnackbarProps'
import Text from './Text'
import IconButton from './IconButton'
import { ButtonColor, IconButtonColor } from './props/ButtonProps'
import Button from './Button'

import '../assets/components/Snackbar.css'

/**
 * Snackbar compliant with Material Design 3 principles.
 *
 * Spec: https://m3.material.io/components/snackbar/overview
 *
 * ### Visibility
 *
 * You are responsible for showing/hiding the snackbar by placing it in parent's JSX and conditional rendering. It won't
 * disappear on its own.
 *
 * ### Buttons
 *
 * Close button would be shown on the snackbar when `onClosed()` callback for such button is provided.
 *
 * When `actionButton` prop is provided then an additional trailing action button would appear on snackbar. It would
 * trigger the `actionButton.onClick()` callback.
 */
const Snackbar: React.FunctionComponent<SnackbarProps> = ({
    message,
    onClosed = undefined,
    actionButton = undefined
}) => {
    const style = `md-snackbar-container${onClosed ? ' md-snackbar-with-close' : ''}${message.length > 50 ? ' md-snackbar-two-line' : ''}`
    useEffect(() => {
        if (message.length > 120)
            console.warn('Message in snackbar is longer than recommended (> 120 chars).')
    }, [message])

    return (
        <div role="alert" className={style}>
            <Text>{message}</Text>
            <div className="md-snackbar-buttons-container">
                {actionButton && (
                    <Button
                        label={actionButton.label}
                        color={ButtonColor.lightInverseText}
                        onClick={actionButton.onClick}
                    />
                )}
                {onClosed && (
                    <IconButton
                        iconName="close"
                        color={IconButtonColor.lightInverse}
                        onClick={onClosed}
                    />
                )}
            </div>
        </div>
    )
}

export default Snackbar
