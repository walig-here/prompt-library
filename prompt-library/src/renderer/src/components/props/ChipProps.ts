import React from 'react'

export interface ChipProps {
    label: string
    type: ChipType
    disabled?: boolean
    onClick?: React.MouseEventHandler<HTMLDivElement>
    leadingIcon?: ChipIconData
    trailingIcon?: ChipIconData
    selected?: boolean
}

export type ChipIconData = {
    iconName: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
}

export enum ChipType {
    ASSIST = 'assist-chip',
    FILTER = 'filter-chip',
    INPUT = 'input-chip',
    SUGGESTION = 'suggestion-chip'
}

export const MAX_CHIP_LABEL_LENGTH = 20
