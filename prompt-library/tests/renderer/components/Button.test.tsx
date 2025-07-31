import { expect, test, vi, describe, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Button from '../../../src/renderer/src/components/Button'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import createMaterialSymbolsApiMock from '../../mocks/materialSymbolsApi'

describe('Display label', () => {
    test('when label prop passed then button with this label is present', () => {
        render(<Button label="label" />)
        const button = screen.getByText(/label/)

        expect(button).toBeInTheDocument()
    })
})

describe('Disable button', () => {
    test('when disable prop passed then button is disabled in DOM', () => {
        render(<Button label="OK" disabled={true} />)
        const element = screen.getByRole('button')

        expect(element).toBeDisabled()
    })

    test('when enable prop passed then button is enabled in DOM', () => {
        render(<Button label="OK" disabled={false} />)
        const element = screen.getByRole('button')

        expect(element).not.toBeDisabled()
    })

    test('when button is clicked and enabled then click callback is executed', async () => {
        const user = userEvent.setup()
        const callback = vi.fn()
        render(<Button label="OK" disabled={false} onClick={callback} />)
        const element = screen.getByRole('button')

        await user.click(element)

        expect(callback).toBeCalledTimes(1)
    })

    test('when button is clicked and disabled then click callback is not executed', async () => {
        const user = userEvent.setup()
        const callback = vi.fn()
        render(<Button label="OK" disabled={true} onClick={callback} />)
        const element = screen.getByRole('button')

        await user.click(element)

        expect(callback).not.toBeCalled()
    })
})

describe('Display icon', () => {
    const materialSymbolsApiMock = createMaterialSymbolsApiMock(['blah123'])

    beforeAll(() => {
        materialSymbolsApiMock.listen()
    })
    afterAll(() => {
        materialSymbolsApiMock.close()
    })
    afterEach(() => {
        materialSymbolsApiMock.resetHandlers()
    })

    test('when valid M3 icon name is passed to props then icon is displayed', async () => {
        render(<Button label="ok" icon_name="search" />)

        await waitFor(() => {
            const button = screen.queryByRole('button')
            expect(button).toBeInTheDocument()

            const label = screen.queryByText(/ok/)
            expect(label).toBeInTheDocument()

            const icon = screen.queryByText(/search/)
            expect(icon).toBeInTheDocument()
        })
    })

    test('when invalid M3 icon name is passed to props then icon is not displayed', async () => {
        render(<Button label="ok" icon_name="blah123" />)

        await waitFor(
            () => {
                const button = screen.queryByRole('button')
                expect(button).toBeInTheDocument()

                const label = screen.queryByText(/ok/)
                expect(label).toBeInTheDocument()
            },
            { timeout: 1_000 } // timeout needed here to ensure that icon validation ends
        )
        const icon = screen.queryByText(/blah123/)
        expect(icon).not.toBeInTheDocument()
    })

    test('when no icon name is passed to props then icon is not displayed', async () => {
        render(<Button label="ok" />)

        await waitFor(
            () => {
                const button = screen.queryByRole('button')
                expect(button).toBeInTheDocument()

                const label = screen.queryByText(/ok/)
                expect(label).toBeInTheDocument()
            },
            { timeout: 1_000 } // timeout needed here to ensure that eventual, unexpected icon validation ends
        )
        const buttonContents = screen.queryByRole('button')?.childNodes[0]
        expect(buttonContents?.childNodes).toHaveLength(1)
    })
})
