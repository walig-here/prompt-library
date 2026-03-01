import { describe, expect, test, vi } from 'vitest'
import Dialog from '../../../src/renderer/src/components/Dialog'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'

describe('rendering', () => {
    test('child components would be rendered in dialog when they are passed to props', () => {
        render(
            <Dialog mainButton={{ label: 'button 1', onClick: () => {} }} supportingText="">
                <button>OK</button>
                <input type="text" placeholder="input text" />
            </Dialog>
        )

        expect(screen.getByText(/ok/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/input text/i)).toBeInTheDocument()
    })

    test('only main button would be rendered in dialog when no secondary button data is passed', () => {
        render(<Dialog mainButton={{ label: 'button 1', onClick: () => {} }} supportingText="" />)

        expect(screen.getByText(/button 1/)).toBeInTheDocument()
        expect(screen.getAllByRole('button').length).toBe(1)
    })

    test('both main and secondary buttons would be rendered in dialog when secondary button data is passed', () => {
        render(
            <Dialog
                mainButton={{ label: 'button 1', onClick: () => {} }}
                supportingText=""
                secondaryButton={{ label: 'button 2', onClick: () => {} }}
            />
        )

        expect(screen.getByText(/button 1/)).toBeInTheDocument()
        expect(screen.getByText(/button 2/)).toBeInTheDocument()
        expect(screen.getAllByRole('button').length).toBe(2)
    })

    test('supportive test should be rendered when it is passed to dialog props', () => {
        render(
            <Dialog
                mainButton={{ label: 'button 1', onClick: () => {} }}
                supportingText="Supporting text"
            />
        )

        expect(screen.getByText(/Supporting text/)).toBeInTheDocument()
    })
})

describe('interactions', () => {
    const user = userEvent.setup()

    test('dialog children can be interacted with when dialog is visible', async () => {
        const childButtonOnClick = vi.fn()
        render(
            <Dialog mainButton={{ label: 'dialog button 1', onClick: () => {} }} supportingText="">
                <button onClick={childButtonOnClick}>Child Button</button>
            </Dialog>
        )

        await user.click(screen.getByText(/child button/i))

        expect(childButtonOnClick).toHaveBeenCalledOnce()
    })

    test('main button callback should be called when main button is clicked', async () => {
        const onMainButtonClicked = vi.fn()
        render(
            <Dialog
                mainButton={{ label: 'dialog button 1', onClick: onMainButtonClicked }}
                supportingText=""
            />
        )

        await user.click(screen.getByText(/dialog button 1/i))

        expect(onMainButtonClicked).toHaveBeenCalledOnce()
    })

    test('secondary button callback should be called when secondary button is clicked', async () => {
        const onMainButtonClicked = vi.fn()
        const onSecondaryButtonClicked = vi.fn()
        render(
            <Dialog
                mainButton={{ label: 'dialog button 1', onClick: onMainButtonClicked }}
                supportingText=""
                secondaryButton={{ label: 'dialog button 2', onClick: onSecondaryButtonClicked }}
            />
        )

        await user.click(screen.getByText(/dialog button 2/i))

        expect(onSecondaryButtonClicked).toHaveBeenCalledOnce()
        expect(onMainButtonClicked).not.toHaveBeenCalled()
    })
})
