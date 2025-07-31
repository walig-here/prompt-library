import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import Text from '../../../src/renderer/src/components/Text'

describe('render text', () => {
    test('text should render when contents is passed', () => {
        render(<Text>This is test text</Text>)

        const text = screen.getByText(/test text/)

        expect(text).toBeInTheDocument()
    })
})
