import React from 'react'
import { TextColor, TextProps, TextSize, TextType } from './props/TextProps'
import '../assets/components/Text.css'

/**
 * Paragraph of text that is following Material Design 3 typography principles.
 *
 * Displayed text must be passed as child.
 *
 * Specs: https://m3.material.io/styles/typography
 */
const Text: React.FunctionComponent<TextProps> = ({
    children,
    size = TextSize.medium,
    type = TextType.body,
    isEmphasized = false,
    isSerif = false,
    color = TextColor.default
}) => {
    const style = _getTextStyles(size, type, isEmphasized, isSerif, color)

    return color === TextColor.error ? (
        <p className={style} role="alert">
            {children}
        </p>
    ) : (
        <p className={style}>{children}</p>
    )
}

function _getTextStyles(
    size: TextSize,
    type: TextType,
    isEmphasized: boolean,
    isSerif: boolean,
    color: TextColor
): string {
    const sizeAndTypeStyle = `${type.valueOf()}-${size.valueOf()} ${color.valueOf()}`
    const emphasizeStyle = isEmphasized ? `${sizeAndTypeStyle}-emphasized` : ''
    return `${sizeAndTypeStyle} ${emphasizeStyle} ${isSerif ? 'serif' : ''}`
}

export default Text
