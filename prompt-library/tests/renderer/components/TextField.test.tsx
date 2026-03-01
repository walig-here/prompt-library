import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import defineMockedGoogleApiResponses from '../../mocks/materialSymbolsApi'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import TextField from '../../../src/renderer/src/components/TextField'
import {
    TextFieldIcon,
    TextFieldStyle
} from '../../../src/renderer/src/components/props/TextFieldProps'
import userEvent from '@testing-library/user-event'

describe('render empy', () => {
    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'only label should be rendered when no additional elements passed',
        (style) => {
            // Arrange & act
            render(<TextField label="label" style={style} value="" />)

            // Assert
            expect(screen.getByPlaceholderText(/label/i)).toBeInTheDocument()
            expect(screen.queryAllByRole('button').length).toBe(0)
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'supporting text should be rendered when it is passed in props',
        (style) => {
            // Assert & act
            render(
                <TextField label="label" style={style} value="" supportingText="supporting text" />
            )

            // Assert
            expect(screen.getByPlaceholderText(/label/i)).toBeInTheDocument()
            expect(screen.getByText(/supporting text/i)).toBeInTheDocument()
            expect(screen.queryAllByRole('button').length).toBe(0)
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'no trailing icon should be rendered when its data is passed in poprs',
        (style) => {
            // Assert & act
            render(
                <TextField
                    label="label"
                    style={style}
                    value=""
                    trailingIcon={{ iconName: 'add' }}
                />
            )

            // Assert
            expect(screen.getByPlaceholderText(/label/i)).toBeInTheDocument()
            expect(screen.queryAllByRole('button').length).toBe(0)
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'leading icon should be rendered when its data is passed in props',
        (style) => {
            // Assert & act
            render(
                <TextField label="label" style={style} value="" leadingIcon={{ iconName: 'add' }} />
            )

            // Assert
            expect(screen.getByPlaceholderText(/label/i)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'no prefix should be rendered when its data is passed in props',
        (style) => {
            // Assert & act
            render(<TextField label="label" style={style} value="" prefix="prefix" />)

            // Assert
            expect(screen.getByPlaceholderText(/label/i)).toBeInTheDocument()
            expect(screen.queryByText(/prefix/i)).not.toBeInTheDocument()
            expect(screen.queryAllByRole('button').length).toBe(0)
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'no suffix should be rendered when its data is passed in props',
        (style) => {
            // Assert & act
            render(<TextField label="label" style={style} value="" suffix="suffix" />)

            // Assert
            expect(screen.getByPlaceholderText(/label/i)).toBeInTheDocument()
            expect(screen.queryByText(/suffix/i)).not.toBeInTheDocument()
            expect(screen.queryAllByRole('button').length).toBe(0)
        }
    )

    test.each([
        [noSupportingTextAndTrailingIcon, TextFieldStyle.filled],
        [noSupportingTextAndTrailingIcon, TextFieldStyle.outlined],
        [supportingTextAndTrailingIcon, TextFieldStyle.filled],
        [supportingTextAndTrailingIcon, TextFieldStyle.outlined]
    ])(
        'error icon and supporting text with error message should be rendered when components is in error state',
        (renderData, style) => {
            // Assert & act
            render(
                <TextField
                    label="label"
                    style={style}
                    value=""
                    validationStrategy={(text) =>
                        text === ''
                            ? { reason: 'error message', success: false }
                            : { success: true }
                    }
                    supportingText={renderData.supportingText}
                    trailingIcon={renderData.trailingIconData}
                />
            )

            // Assert
            expect(screen.getByPlaceholderText(/label/i)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /error/i })).toBeInTheDocument()
            expect(screen.getByText(/error message/i)).toBeInTheDocument()
        }
    )
})

describe('render populated', () => {
    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'only label and value should be rendered when no additional elements passed',
        (style) => {
            // Arrange & act
            render(<TextField label="label" style={style} value="value" />)

            // Assert
            const input: HTMLInputElement = screen.getByRole('textbox')
            expect(input.value).toBe('value')
            expect(screen.getByText(/label/i)).toBeInTheDocument()
            expect(screen.queryAllByRole('button').length).toBe(0)
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'supporting text, label and value should be rendered when it is passed in props',
        (style) => {
            // Assert & act
            render(
                <TextField
                    label="label"
                    style={style}
                    value="value"
                    supportingText="supporting text"
                />
            )

            // Assert
            const input: HTMLInputElement = screen.getByRole('textbox')
            expect(input.value).toBe('value')
            expect(screen.getByText(/label/i)).toBeInTheDocument()
            expect(screen.getByText(/supporting text/i)).toBeInTheDocument()
            expect(screen.queryAllByRole('button').length).toBe(0)
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'trailing icon, label and value should be rendered when its data is passed in poprs',
        (style) => {
            // Assert & act
            render(
                <TextField
                    label="label"
                    style={style}
                    value="value"
                    trailingIcon={{ iconName: 'add' }}
                />
            )

            // Assert
            const input: HTMLInputElement = screen.getByRole('textbox')
            expect(input.value).toBe('value')
            expect(screen.getByText(/label/i)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'leading icon, label and value should be rendered when its data is passed in props',
        (style) => {
            // Assert & act
            render(
                <TextField
                    label="label"
                    style={style}
                    value="value"
                    leadingIcon={{ iconName: 'add' }}
                />
            )

            // Assert
            const input: HTMLInputElement = screen.getByRole('textbox')
            expect(input.value).toBe('value')
            expect(screen.getByText(/label/i)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'prefix, label and value should be rendered when its data is passed in props',
        (style) => {
            // Assert & act
            render(<TextField label="label" style={style} value="value" prefix="prefix" />)

            // Assert
            const input: HTMLInputElement = screen.getByRole('textbox')
            expect(input.value).toBe('value')
            expect(screen.getByText(/label/i)).toBeInTheDocument()
            expect(screen.getByText(/prefix/i)).toBeInTheDocument()
            expect(screen.queryAllByRole('button').length).toBe(0)
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'suffix, value and label should be rendered when its data is passed in props',
        (style) => {
            // Assert & act
            render(<TextField label="label" style={style} value="value" suffix="suffix" />)

            // Assert
            const input: HTMLInputElement = screen.getByRole('textbox')
            expect(input.value).toBe('value')
            expect(screen.getByText(/label/i)).toBeInTheDocument()
            expect(screen.getByText(/suffix/i)).toBeInTheDocument()
            expect(screen.queryAllByRole('button').length).toBe(0)
        }
    )

    test.each([
        [noSupportingTextAndTrailingIcon, TextFieldStyle.filled],
        [noSupportingTextAndTrailingIcon, TextFieldStyle.outlined],
        [supportingTextAndTrailingIcon, TextFieldStyle.filled],
        [supportingTextAndTrailingIcon, TextFieldStyle.outlined]
    ])(
        'error icon, supporting text with error message, label and value should be rendered when components is in error state',
        (renderData, style) => {
            // Assert & act
            render(
                <TextField
                    label="label"
                    style={style}
                    value="value"
                    validationStrategy={(text) =>
                        text !== ''
                            ? { reason: 'error message', success: false }
                            : { success: true }
                    }
                    supportingText={renderData.supportingText}
                    trailingIcon={renderData.trailingIconData}
                />
            )

            // Assert
            const input: HTMLInputElement = screen.getByRole('textbox')
            expect(input.value).toBe('value')
            expect(screen.getByText(/label/i)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /error/i })).toBeInTheDocument()
            expect(screen.getByText(/error message/i)).toBeInTheDocument()
        }
    )
})

describe('user interaction', () => {
    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'on change callback should be called when user changes value in the input',
        async (style) => {
            // Arrange
            const onChangeCallback = vi.fn()
            render(<TextField label="label" value="" style={style} onChange={onChangeCallback} />)

            // Act
            await user.type(screen.getByRole('textbox'), 'value')

            // Assert
            expect(onChangeCallback).toBeCalledTimes(5)
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'trailing icon callback should be called when user clicks trailing icon',
        async (style) => {
            // Arrange
            const onClickCallback = vi.fn()
            render(
                <TextField
                    label="label"
                    value="value"
                    style={style}
                    trailingIcon={{ iconName: 'add', onClick: onClickCallback }}
                />
            )

            // Act
            await user.click(screen.getByRole('button', { name: /add/i }))

            // Assert
            expect(onClickCallback).toBeCalledTimes(1)
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'leading icon callback should be called when user clicks leading icon',
        async (style) => {
            // Arrange
            const onClickCallback = vi.fn()
            render(
                <TextField
                    label="label"
                    value="value"
                    style={style}
                    leadingIcon={{ iconName: 'add', onClick: onClickCallback }}
                />
            )

            // Act
            await user.click(screen.getByRole('button', { name: /add/i }))

            // Assert
            expect(onClickCallback).toBeCalledTimes(1)
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'on change callback should not be called when user changes value in the disabled component',
        async (style) => {
            // Arrange
            const onChangeCallback = vi.fn()
            render(
                <TextField
                    label="label"
                    value=""
                    style={style}
                    onChange={onChangeCallback}
                    disabled={true}
                />
            )

            // Act
            await user.type(screen.getByRole('textbox'), 'value')

            // Assert
            expect(onChangeCallback).not.toBeCalled()
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'trailing icon callback should not be called when user clicks trailing icon in the disabled component',
        async (style) => {
            // Arrange
            const onClickCallback = vi.fn()
            render(
                <TextField
                    label="label"
                    value="value"
                    style={style}
                    trailingIcon={{ iconName: 'add', onClick: onClickCallback }}
                    disabled={true}
                />
            )

            // Act
            await user.click(screen.getByRole('button', { name: /add/i }))

            // Assert
            expect(onClickCallback).not.toBeCalled()
        }
    )

    test.each([TextFieldStyle.filled, TextFieldStyle.outlined])(
        'leading icon callback should not be called when user clicks leading icon in the disabled component',
        async (style) => {
            // Arrange
            const onClickCallback = vi.fn()
            render(
                <TextField
                    label="label"
                    value="value"
                    style={style}
                    leadingIcon={{ iconName: 'add', onClick: onClickCallback }}
                    disabled={true}
                />
            )

            // Act
            await user.click(screen.getByRole('button', { name: /add/i }))

            // Assert
            expect(onClickCallback).not.toBeCalled()
        }
    )

    const user = userEvent.setup()
})

const googleApiMock = defineMockedGoogleApiResponses([])
beforeAll(() => googleApiMock.listen())
afterEach(() => googleApiMock.resetHandlers())
afterAll(() => googleApiMock.close())

interface RenderData {
    supportingText: string
    trailingIconData?: undefined | TextFieldIcon
}

const noSupportingTextAndTrailingIcon: RenderData = {
    supportingText: '',
    trailingIconData: undefined
}
const supportingTextAndTrailingIcon: RenderData = {
    supportingText: 'supporting text',
    trailingIconData: { iconName: 'add' }
}
