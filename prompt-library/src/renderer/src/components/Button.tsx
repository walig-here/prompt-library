import React from 'react'
import '../assets/components/Button.css'
import { ButtonProps, ButtonSize, ButtonShape, ButtonColor } from './props/ButtonProps'
import Icon from './Icon'
import { IconProps } from './props/IconProps'

/**
 * Button that follows M3 principles.
 *
 * Spec: https://m3.material.io/components/buttons/specs
 */
const Button: React.FunctionComponent<ButtonProps> = ({
    label,
    onClick,
    icon_name,
    size = ButtonSize.small,
    shape = ButtonShape.round,
    color = ButtonColor.filled,
    disabled = false
}) => {
    const buttonStyle = _buildButtonStyle(shape, size, color)
    const contentsStyle = _buildButtonContentsStyle(size)
    const iconProps = icon_name ? _buildIconProps(size, icon_name) : undefined

    return (
        <button onClick={onClick} disabled={disabled} className={buttonStyle} type="button">
            <div className={contentsStyle}>
                {!!iconProps && <Icon name={iconProps.name} size={iconProps.size} />}
                {label}
            </div>
        </button>
    )
}

function _buildIconProps(size: ButtonSize, iconName: string): IconProps {
    const iconProps: IconProps = { name: iconName }

    switch (size) {
        case ButtonSize.medium:
            iconProps.size = 24
            break
        case ButtonSize.large:
            iconProps.size = 40
            break
        case ButtonSize.extraLarge:
            iconProps.size = 40
            break
        default:
            iconProps.size = 20
    }

    return iconProps
}

function _buildButtonContentsStyle(size: ButtonSize): string {
    const BASE_CONTENTS_STYLE = 'md-button-contents'

    switch (size) {
        case ButtonSize.large:
            return `${BASE_CONTENTS_STYLE} ${BASE_CONTENTS_STYLE}-large`
        case ButtonSize.extraLarge:
            return `${BASE_CONTENTS_STYLE} ${BASE_CONTENTS_STYLE}-extra-large`
        default:
            return BASE_CONTENTS_STYLE
    }
}

function _buildButtonStyle(shape: ButtonShape, size: ButtonSize, color: ButtonColor): string {
    const size_name = size.valueOf().replace(/md-button-/, '')
    const shapeAndSize = `${shape.valueOf()}-${size_name}`

    return `md-button ${size.valueOf()} ${shapeAndSize} ${color.valueOf()}`
}

export default Button
