import React from 'react'
import {
    ButtonShape,
    ButtonSize,
    IconButtonColor,
    IconButtonProps,
    IconButtonWidth
} from './props/ButtonProps'
import Icon from './Icon'
import '../assets/components/IconButton.css'
import { IconSize } from './props/IconProps'

/**
 * Icon button that follows Material Design 3 principles.
 *
 * It should rander as empty when icon name that matches no material symbol is injected.
 *
 * Spec: https://m3.material.io/components/icon-buttons/specs
 */
const IconButton: React.FunctionComponent<IconButtonProps> = ({
    iconName,
    color = IconButtonColor.filled,
    onClick = () => {},
    disabled = false,
    shape = ButtonShape.round,
    size = ButtonSize.small,
    width = IconButtonWidth.default
}) => {
    const buttonStyle = _getButtonStyle(size, width, color, shape)
    const iconSize = _getIconSize(size)

    return (
        <button onClick={onClick} disabled={disabled} className={buttonStyle} type="button">
            <Icon name={iconName} size={iconSize} />
        </button>
    )
}

function _getButtonStyle(
    size: ButtonSize,
    width: IconButtonWidth,
    color: IconButtonColor,
    shape: ButtonShape
): string {
    const shapeStyle = `${shape}-${size.valueOf().replace(/md-button-/, '')}-icon`
    const widthStyle = `${size.valueOf()}-${width.valueOf()}-icon`

    return `md-button-icon ${size.valueOf()}-icon ${shapeStyle} ${widthStyle} ${color.valueOf()}`
}

function _getIconSize(buttonSize: ButtonSize): IconSize {
    switch (buttonSize) {
        case ButtonSize.extraSmall:
            return 20
        case ButtonSize.small:
            return 24
        case ButtonSize.medium:
            return 24
        default:
            return 40
    }
}

export default IconButton
