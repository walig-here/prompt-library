import { describe, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import Snackbar from '../../../src/renderer/src/components/Snackbar'
import userEvent from '@testing-library/user-event'

describe('rendering', () => {
    test('only message should be displayed when no buttons data is passed', () => {
        // Arrange & Act
        render(<Snackbar message="test message" />)

        // Assert
        expect(screen.getByText(/test message/i)).toBeInTheDocument()
        expect(screen.queryAllByRole('button').length).toBe(0)
    })

    test('message and close button should be displayed when on close callback is passed', () => {
        // Arrange & Act
        render(<Snackbar message="test message" onClosed={() => {}} />)

        // Assert
        expect(screen.getByText(/test message/i)).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('message and actions button should be displayed when action button data is passed', () => {
        // Arrange & Act
        render(
            <Snackbar message="test message" actionButton={{ label: 'ok', onClick: () => {} }} />
        )

        // Assert
        expect(screen.getByText(/test message/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument()
    })

    test('message and both close and actions buttons should be displayed and on close button and action button dat is passed', () => {
        // Arrange & Act
        render(
            <Snackbar
                message="test message"
                actionButton={{ label: 'ok', onClick: () => {} }}
                onClosed={() => {}}
            />
        )

        // Assert
        expect(screen.getByText(/test message/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })
})

describe('interactions', () => {
    const user = userEvent.setup()

    test('on close callback should be called when user clicks close button', async () => {
        // Arrange
        const onCloseCallback = vi.fn()
        render(<Snackbar message="test" onClosed={onCloseCallback} />)

        // Act
        await user.click(screen.getByRole('button', { name: /close/i }))

        // Assert
        expect(onCloseCallback).toHaveBeenCalledOnce()
    })

    test('action callback should be called when user clicks action button', async () => {
        // Arrange
        const actionButtonCallback = vi.fn()
        render(
            <Snackbar
                message="test"
                actionButton={{ label: 'ok', onClick: actionButtonCallback }}
            />
        )

        // Act
        await user.click(screen.getByRole('button', { name: /ok/i }))

        // Assert
        expect(actionButtonCallback).toHaveBeenCalledOnce()
    })
})
