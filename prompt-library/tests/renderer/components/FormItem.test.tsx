import { afterEach } from 'node:test'
import defineMockedGoogleApiResponses from '../../mocks/materialSymbolsApi'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import FormItem from '../../../src/renderer/src/components/FormItem'
import userEvent from '@testing-library/user-event'

describe('render', () => {
    test('only buttons, label and text input should be rendered when no description is passed', () => {
        // Arrange & Act
        render(<FormItem value="value" label="label" />)

        // Assert
        const input: HTMLInputElement | HTMLTextAreaElement = screen.getByRole('textbox')
        expect(input.value).toBe('value')
        expect(screen.getByRole('button', { name: /.*clear/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /restore default/i })).toBeInTheDocument()
        expect(screen.getAllByText(/label/i).length).toBe(2) // input label and component label
    })

    test('buttons, label, text input and description should be rendered when description is passed', () => {
        // Arrange & Act
        render(<FormItem value="value" label="label" description="description" />)

        // Assert
        const input: HTMLInputElement | HTMLTextAreaElement = screen.getByRole('textbox')
        expect(input.value).toBe('value')
        expect(screen.getByRole('button', { name: /.*clear/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /restore default/i })).toBeInTheDocument()
        expect(screen.getAllByText(/label/i).length).toBe(2) // input label and component label
        expect(screen.getByText(/description/i)).toBeInTheDocument()
    })
})

describe('user interactions', () => {
    const user = userEvent.setup()

    test('change callback should be called when user types text in text input', async () => {
        // Arrange
        const onChangeCallback = vi.fn()
        render(<FormItem label="label" value="" onChange={onChangeCallback} />)

        // Act
        await user.type(screen.getByRole('textbox'), 'user input')

        // Arrange
        expect(onChangeCallback).toBeCalledTimes(10)
    })

    test.each(['', 'user input', 'default_value'])(
        'change callback with clear value should be called when user clicks the clear button',
        async (value) => {
            // Arrange
            const onChangeCallback = vi.fn()
            render(<FormItem value={value} label="label" onChange={onChangeCallback} />)

            // Act
            await user.click(screen.getByRole('button', { name: /.*clear/i }))

            // Assert
            expect(onChangeCallback).toBeCalledTimes(1)
            expect(onChangeCallback).toBeCalledWith({ target: { value: '' } })
        }
    )

    test.each(['', 'user input', 'default_value'])(
        'change callback with default value should be called when user clicks the restore default button',
        async (value) => {
            // Arrange
            const onChangeCallback = vi.fn()
            render(
                <FormItem
                    value={value}
                    label="label"
                    onChange={onChangeCallback}
                    defaultValue="default_value"
                />
            )

            // Act
            await user.click(screen.getByRole('button', { name: /restore default/i }))

            // Assert
            expect(onChangeCallback).toBeCalledTimes(1)
            expect(onChangeCallback).toBeCalledWith({ target: { value: 'default_value' } })
        }
    )
})

const gooleApiMock = defineMockedGoogleApiResponses([])
beforeAll(() => gooleApiMock.listen())
afterAll(() => gooleApiMock.close())
afterEach(() => gooleApiMock.resetHandlers())
