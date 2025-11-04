import React, { useEffect, useRef } from 'react'
import { CheckboxProps, CheckboxState } from './props/CheckboxProps'
import '../assets/components/Checkbox.css'

/**
 * A checkbox that follows Material Design 3 principles.
 *
 * Specs: https://m3.material.io/components/checkbox/specs
 *
 * ### State
 *
 * Checkbox can be in one of 6 states that are passed through the `state` prop:
 *
 * 1. Checked
 * 2. Mixed (intermidiate state between beeing checked and unchecked)
 * 3. Unchecked
 *
 * ### Interactions
 *
 * Each time user clicks on non-disabled checkbox the `onChange()` and `onClick()` callbacks would be called.
 */
const Checkbox: React.FunctionComponent<CheckboxProps> = ({
    state,
    disabled = false,
    onChange = undefined,
    onClick = undefined
}: CheckboxProps) => {
    const checkboxInput: React.Ref<HTMLInputElement | null> = useRef(null)

    useEffect(() => {
        if (checkboxInput.current === null) return
        checkboxInput.current.indeterminate = state === CheckboxState.mixed
    }, [state])

    const onInputClicked: React.MouseEventHandler<HTMLInputElement> = (event) => {
        if (state === CheckboxState.mixed) {
            event.preventDefault()
        }

        if (onClick) {
            onClick(event)
        }
    }

    return (
        <div className="md-checkbox-container">
            <input
                type="checkbox"
                ref={checkboxInput}
                onChange={onChange}
                onClick={onInputClicked}
                disabled={disabled}
                checked={state === CheckboxState.checked}
                className="md-checkbox"
                readOnly={!onChange}
            />
        </div>
    )
}

export default Checkbox
