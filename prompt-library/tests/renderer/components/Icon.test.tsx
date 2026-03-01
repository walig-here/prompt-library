import { render, screen, waitFor } from '@testing-library/react'
import Icon from '../../../src/renderer/src/components/Icon'
import defineMockedGoogleApiResponses from '../../mocks/materialSymbolsApi'
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'

describe('Render icon', () => {
    const materialSymbolsApiMock = defineMockedGoogleApiResponses(['invalid_symbol'])

    beforeAll(() => {
        materialSymbolsApiMock.listen()
    })
    afterAll(() => {
        materialSymbolsApiMock.close()
    })
    afterEach(() => {
        materialSymbolsApiMock.resetHandlers()
    })

    test('icon should be rendered when icon name matches existing material symbol', async () => {
        render(<Icon name="search" />)

        await waitFor(() => {
            const icon = screen.queryByText(/search/)

            expect(icon).toBeInTheDocument()
        })
    })

    test('icons should not render when icon name does not match existing material symbol', async () => {
        render(<Icon name="invalid_symbol" />)

        await waitFor(() => {}, { timeout: 1_000 })
        const icon = screen.queryByText(/invalid_symbol/)

        expect(icon).not.toBeInTheDocument()
    })
})
