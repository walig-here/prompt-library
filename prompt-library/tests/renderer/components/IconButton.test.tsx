import { render, screen, waitFor } from '@testing-library/react'
import IconButton from '../../../src/renderer/src/components/IconButton'
import { afterAll, beforeAll, afterEach, describe, expect, test, vi } from 'vitest'
import defineMockedGoogleApiResponses from '../../mocks/materialSymbolsApi'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'

describe('render icon button', () => {
    const materialSymbolGoogleApiMock = defineMockedGoogleApiResponses(['invalid'])

    beforeAll(() => {
        materialSymbolGoogleApiMock.listen()
    })
    afterAll(() => {
        materialSymbolGoogleApiMock.close()
    })
    afterEach(() => {
        materialSymbolGoogleApiMock.resetHandlers()
    })

    test('button should have rendered icon when valid material symbol name is passed', () => {
        render(<IconButton iconName="start" />)

        const button = screen.getByRole('button')
        const icon = screen.getByText(/start/)

        expect(button).toBeInTheDocument()
        expect(icon).toBeInTheDocument()
    })

    test('button should not bave rendered icon when invalid material symbol name is passed', async () => {
        render(<IconButton iconName="invalid" />)

        const button = screen.getByRole('button')
        await waitFor(() => {}, { timeout: 1_000 })
        const icon = screen.queryByText(/invalid/)

        expect(button).toBeInTheDocument()
        expect(icon).not.toBeInTheDocument()
    })
})

describe('click button', () => {
    const materialSymbolGoogleApiMock = defineMockedGoogleApiResponses([''])

    beforeAll(() => {
        materialSymbolGoogleApiMock.listen()
    })
    afterAll(() => {
        materialSymbolGoogleApiMock.close()
    })
    afterEach(() => {
        materialSymbolGoogleApiMock.resetHandlers()
    })

    test('callback should be called when user clicks enabled button', async () => {
        const callback = vi.fn()
        render(<IconButton iconName="start" onClick={callback} disabled={false} />)
        const button = screen.getByRole('button')
        await userEvent.click(button)

        expect(callback).toBeCalledTimes(1)
    })

    test('callback should not be called when user clicks disabled button', async () => {
        const callback = vi.fn()
        render(<IconButton iconName="start" onClick={callback} disabled={true} />)
        const button = screen.getByRole('button')
        await userEvent.click(button)

        expect(callback).not.toBeCalled()
    })
})
