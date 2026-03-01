import { JSX } from 'react'
import IconButton from './IconButton'
import { ChipIconData, ChipProps, ChipType, MAX_CHIP_LABEL_LENGTH } from './props/ChipProps'
import Text from './Text'
import '../assets/components/Chip.css'
import { ButtonSize, IconButtonColor } from './props/ButtonProps'
import { TextColor, TextSize, TextType } from './props/TextProps'

/**
 * Chip compliant with Material Design 3 principles.
 *
 * Specs: https://m3.material.io/components/chips/specs
 *
 * ### Selecting chip
 *
 * Chips can be selected with the use of `selected` prop.
 *
 * ### Chip types
 *
 * There are 4 chip types according to the MD3. Each of them is different when it comes to number of displayed elements.
 * When chip's props misses data for its elements then the `RuntimeError` is thrown. Surplus data is just ignored.
 *
 * - **Assist Chip:** Label, leading icon.
 * - **Filter Chip:** Label, leading icon (optional), trailing icon (optional).
 * - **Input Chip:** Label, leading icon (optional), trailing icon.
 * - **Suggestion Chip:** Label.
 *
 * ### User interactions
 *
 * Users have serveral ways to interact with the chip:
 *
 * - **Clicking the chip:** Triggers chip's `onClick()` callback.
 * - **Clicking leading icon:** Triggers leading icon's `onClick()` callback.
 * - **Clicking trailing icon:** Triggers leading icon's `onClick()` callback.
 *
 * None of this interactions is available when `disabled` component is passed with `true` value.
 */
const Chip: React.FunctionComponent<ChipProps> = ({
    label,
    type,
    onClick = () => {},
    trailingIcon = undefined,
    leadingIcon = undefined,
    disabled = false,
    selected = false
}: ChipProps) => {
    _validateProps({
        label: label,
        type: type,
        disabled: disabled,
        leadingIcon: leadingIcon,
        onClick: onClick,
        trailingIcon: trailingIcon
    })
    if (label.length > MAX_CHIP_LABEL_LENGTH)
        console.warn(`Max length for chip's label should be 20 but it's ${label.length}.`)

    return (
        <div
            onClick={disabled ? () => {} : onClick}
            role="button"
            className={_containerStyle(!!leadingIcon, !!trailingIcon, selected)}
        >
            {_getLeadingIcon(type, leadingIcon, disabled)}
            <Text
                size={TextSize.large}
                type={TextType.label}
                color={selected ? TextColor.secondary : TextColor.default}
            >
                {label}
            </Text>
            {_getTrailingIcon(type, trailingIcon, disabled)}
        </div>
    )
}

const _containerStyle = (
    leadingIcon: boolean,
    trailingIcon: boolean,
    selected: boolean
): string => {
    let styles = 'md-chip-container'
    if (leadingIcon) styles += ' md-chip-container-with-leading-icon'
    if (trailingIcon) styles += ' md-chip-container-with-trailing-icon'
    if (selected) styles += ' md-chip-container-selected'
    return styles
}

const _getLeadingIcon = (
    type: ChipType,
    leadingIcon: ChipIconData | undefined,
    disabled: boolean
): JSX.Element | undefined => {
    return type === ChipType.SUGGESTION || leadingIcon === undefined ? undefined : (
        <IconButton
            iconName={leadingIcon.iconName}
            onClick={(e) => {
                e.stopPropagation()
                if (leadingIcon.onClick !== undefined) leadingIcon.onClick(e)
            }}
            disabled={disabled}
            size={ButtonSize.extraSmall}
            color={IconButtonColor.primary}
        />
    )
}

const _getTrailingIcon = (
    type: ChipType,
    trailingIcon: ChipIconData | undefined,
    disabled: boolean
): JSX.Element | undefined => {
    if ([ChipType.ASSIST, ChipType.SUGGESTION].includes(type) || trailingIcon === undefined)
        return undefined
    return (
        <IconButton
            iconName={trailingIcon.iconName}
            onClick={(e) => {
                e.stopPropagation()
                if (trailingIcon.onClick !== undefined) trailingIcon.onClick(e)
            }}
            disabled={disabled}
            size={ButtonSize.extraSmall}
            color={IconButtonColor.primary}
        />
    )
}

const _validateProps = (props: ChipProps): void => {
    switch (props.type) {
        case ChipType.ASSIST:
            if (props.leadingIcon === undefined)
                throw new Error('Assist chip requires laeding icon data.')
            break
        case ChipType.INPUT:
            if (props.trailingIcon === undefined)
                throw new Error('Input chip requires trailing icon data.')
            break
    }
}

export default Chip
