export interface ButtonProps {
    label: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    icon_name?: string
    size?: ButtonSize
    shape?: ButtonShape
    color?: ButtonColor
    disabled?: boolean
}

export interface IconButtonProps {
    iconName: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    size?: ButtonSize
    shape?: ButtonShape
    color?: IconButtonColor
    width?: IconButtonWidth
    disabled?: boolean
}

export enum ButtonSize {
    extraSmall = 'md-button-extra-small',
    small = 'md-button-small',
    medium = 'md-button-medium',
    large = 'md-button-large',
    extraLarge = 'md-button-extra-large'
}

export enum ButtonShape {
    round = 'md-button-round',
    square = 'md-button-square'
}

export enum ButtonColor {
    elevated = 'md-button-elevated',
    filled = 'md-button-filled',
    tonal = 'md-button-tonal',
    outlined = 'md-button-outlined',
    text = 'md-button-text',
    filledError = 'md-button-filled-error'
}

export enum IconButtonWidth {
    default = 'default',
    narrow = 'narrow',
    wide = 'wide'
}

export enum IconButtonColor {
    filled = 'md-button-filled-icon',
    tonal = 'md-button-tonal-icon',
    outlined = 'md-button-outlined-icon',
    standard = 'md-button-standard-icon',
    outlinedError = 'md-button-outlined-error-icon'
}
