import { render, screen, waitFor } from '@testing-library/react'
import Checkbox from '../../../src/renderer/src/components/Checkbox'
import { CheckboxState } from '../../../src/renderer/src/components/props/CheckboxProps'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'

describe('state-based rendering', () => {
    test('input should be checked when checkbox in in the checked state', () => {
        render(<Checkbox state={CheckboxState.checked} />)

        expect(screen.getByRole('checkbox')).toBeChecked()
    })

    test('input should be unchecked when checkbox is in the unchecked state', () => {
        render(<Checkbox state={CheckboxState.unchecked} />)

        expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    test('input should be mixed when checkbox is in the unchecked state', () => {
        render(<Checkbox state={CheckboxState.mixed} />)

        expect(screen.getByRole('checkbox')).toBePartiallyChecked()
    })
})

describe('user interactions', () => {
    const onChangeCallbackSpy = vi.fn()
    const user = userEvent.setup()

    test('change callback should be called when user clicks enabled checkbox', async () => {
        const checkbox = renderCheckbox()

        await user.click(checkbox)

        expect(onChangeCallbackSpy).toHaveBeenCalledOnce()
    })

    test('input must not check on itself when user clicks enabled checkbox', async () => {
        const checkbox = renderCheckbox()

        await user.click(checkbox)
        await waitFor(() => {}, { timeout: 1000 })

        expect(checkbox).not.toBeChecked()
    })

    test('input must not uncheck on itself when user clicks enabled, checked checkbox', async () => {
        const checkbox = renderCheckbox(false, CheckboxState.checked)

        await user.click(checkbox)
        await waitFor(() => {}, { timeout: 1000 })

        expect(checkbox).toBeChecked()
    })

    test('input must not uncheck on itself when user clicks enabled, mixed checkbox', async () => {
        const checkbox = renderCheckbox(false, CheckboxState.mixed)

        await user.click(checkbox)
        await waitFor(() => {}, { timeout: 1000 })

        expect(checkbox).toBePartiallyChecked()
    })

    test('change callback should not be called when user clicks disabled checkbox', async () => {
        const checkbox = renderCheckbox(true)

        await user.click(checkbox)

        expect(onChangeCallbackSpy).not.toHaveBeenCalled()
    })

    test('input must not change on itself when user clicks disabled checkbox', async () => {
        const checkbox = renderCheckbox(true)

        await user.click(checkbox)
        await waitFor(() => {}, { timeout: 1000 })

        expect(checkbox).not.toBeChecked()
    })

    beforeEach(() => {
        onChangeCallbackSpy.mockClear()
    })

    const renderCheckbox = (
        disabled: boolean = false,
        state: CheckboxState = CheckboxState.unchecked
    ): HTMLElement => {
        render(<Checkbox state={state} onChange={onChangeCallbackSpy} disabled={disabled} />)
        return screen.getByRole('checkbox')
    }
})
