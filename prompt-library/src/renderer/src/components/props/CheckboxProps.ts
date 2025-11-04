export interface CheckboxProps {
    state: CheckboxState
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    onClick?: React.MouseEventHandler<HTMLInputElement>
    disabled?: boolean
}

export enum CheckboxState {
    checked = 'on',
    mixed = 'mixed',
    unchecked = 'off'
}
