import { render, screen } from '@testing-library/react'
import Chip from '../../../src/renderer/src/components/Chip'
import { ChipType } from '../../../src/renderer/src/components/props/ChipProps'
import { afterAll, beforeAll, describe, expect, test, vi, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import defineMockedGoogleApiResponses from '../../mocks/materialSymbolsApi'

describe('render', () => {
    const chipWithSurplusProps = new Map(
        [ChipType.ASSIST, ChipType.FILTER, ChipType.INPUT, ChipType.SUGGESTION].map(
            (type, index) => [
                type,
                <Chip
                    label="label"
                    type={type}
                    key={index}
                    leadingIcon={{ iconName: 'leading' }}
                    trailingIcon={{ iconName: 'trailing' }}
                />
            ]
        )
    )
    const chipsWithAllViableProps = new Map([
        [
            ChipType.ASSIST,
            <Chip
                label="label"
                type={ChipType.ASSIST}
                leadingIcon={{ iconName: 'leading' }}
                key="0"
            />
        ],
        [
            ChipType.FILTER,
            <Chip
                label="label"
                type={ChipType.FILTER}
                leadingIcon={{ iconName: 'leading' }}
                trailingIcon={{ iconName: 'trailing' }}
                key="1"
            />
        ],
        [
            ChipType.INPUT,
            <Chip
                label="label"
                type={ChipType.INPUT}
                leadingIcon={{ iconName: 'leading' }}
                trailingIcon={{ iconName: 'trailing' }}
                key="2"
            />
        ],
        [ChipType.SUGGESTION, <Chip label="label" type={ChipType.SUGGESTION} key="3" />]
    ])

    // Assist

    test.each([
        chipWithSurplusProps.get(ChipType.ASSIST),
        chipsWithAllViableProps.get(ChipType.ASSIST)
    ])('label and leading icon should render when chip is an assist chip', (chip) => {
        // Arrange & Act
        render(chip)

        // Arrange
        expect(screen.getByText(/label/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /^leading$/i }))
        expect(screen.queryByRole('button', { name: /^trailing$/i })).not.toBeInTheDocument()
    })

    test('runtime error should be thrown when leading icon data is missing for assist chip', () => {
        // Arrange, Act and Assert
        expect(() => render(<Chip label="label" type={ChipType.ASSIST} />)).toThrow(Error)
    })

    // Filter

    test.each([
        chipWithSurplusProps.get(ChipType.FILTER),
        chipsWithAllViableProps.get(ChipType.FILTER)
    ])('label, leading and trailing icon should render when chip is an filter chip', (chip) => {
        // Arrange & Act
        render(chip)

        // Arrange
        expect(screen.getByText(/label/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /^leading$/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /^trailing$/i })).toBeInTheDocument()
    })

    test('label should render when chips is an filter chip with no trailing and leading icon prop', () => {
        // Arrange & Act
        render(<Chip label="label" type={ChipType.FILTER} />)

        // Arrange
        expect(screen.getByText(/label/i)).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /^leading$/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /^trailing$/i })).not.toBeInTheDocument()
    })

    test('label and leading icon should render when chips is an filter chip with no trailing icon prop', () => {
        // Arrange & Act
        render(<Chip label="label" type={ChipType.FILTER} leadingIcon={{ iconName: 'leading' }} />)

        // Arrange
        expect(screen.getByText(/label/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /^leading$/i })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /^trailing$/i })).not.toBeInTheDocument()
    })

    // Input

    test.each([
        chipWithSurplusProps.get(ChipType.INPUT),
        chipsWithAllViableProps.get(ChipType.INPUT)
    ])('label, leading icon and trailing icon should render when chip is an input chip', (chip) => {
        // Arrange & Act
        render(chip)

        // Arrange
        expect(screen.getByText(/label/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /^leading$/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /^trailing$/i })).toBeInTheDocument()
    })

    test('label and trailing icon should render when chip is an input chip with not leading icon prop', () => {
        // Arrange & Act
        render(<Chip label="label" type={ChipType.INPUT} trailingIcon={{ iconName: 'trailing' }} />)

        // Arrange
        expect(screen.getByText(/label/i)).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /^leading$/i })).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: /^trailing$/i })).toBeInTheDocument()
    })

    test('runtime error should be thrown when trailing icon data is missing for input chip', () => {
        // Arrange, Act & Assert
        expect(() => render(<Chip label="label" type={ChipType.INPUT} />)).toThrow(Error)
    })

    // Suggestion

    test.each([
        chipWithSurplusProps.get(ChipType.SUGGESTION),
        chipsWithAllViableProps.get(ChipType.SUGGESTION)
    ])('label should be rendered when chip is a suggestion chip', (chip) => {
        // Arrange & Act
        render(chip)

        // Arrange
        expect(screen.getByText(/label/i)).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /^leading$/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /^trailing$/i })).not.toBeInTheDocument()
    })
})

describe('user interactions', () => {
    const user = userEvent.setup()

    test.each([ChipType.ASSIST, ChipType.FILTER, ChipType.INPUT, ChipType.SUGGESTION])(
        'chip on click callback should be called when user clicks on chip',
        async (type) => {
            // Arrange
            const onClickCallback = vi.fn()
            const leadingIconCallback = vi.fn()
            const trailingIconCallback = vi.fn()
            render(
                <Chip
                    label="label"
                    type={type}
                    leadingIcon={{ iconName: 'leading', onClick: leadingIconCallback }}
                    trailingIcon={{ iconName: 'trailing', onClick: trailingIconCallback }}
                    onClick={onClickCallback}
                />
            )

            // Act
            await user.click(screen.getByRole('button', { name: /label/i }))

            // Assert
            expect(onClickCallback).toBeCalledTimes(1)
            expect(leadingIconCallback).not.toHaveBeenCalled()
            expect(trailingIconCallback).not.toHaveBeenCalled()
        }
    )

    test.each([ChipType.ASSIST, ChipType.FILTER, ChipType.INPUT, ChipType.SUGGESTION])(
        'chip on click callback should not be called when user clicks on disabled chip',
        async (type) => {
            // Arrange
            const onClickCallback = vi.fn()
            const leadingIconCallback = vi.fn()
            const trailingIconCallback = vi.fn()
            render(
                <Chip
                    label="label"
                    type={type}
                    leadingIcon={{ iconName: 'leading', onClick: leadingIconCallback }}
                    trailingIcon={{ iconName: 'trailing', onClick: trailingIconCallback }}
                    onClick={onClickCallback}
                    disabled={true}
                />
            )

            // Act
            await user.click(screen.getByRole('button', { name: /label/i }))

            // Assert
            expect(onClickCallback).not.toHaveBeenCalled()
            expect(leadingIconCallback).not.toHaveBeenCalled()
            expect(trailingIconCallback).not.toHaveBeenCalled()
        }
    )

    test.each([ChipType.FILTER, ChipType.INPUT])(
        'trailign icon callback should be called when user clicks on trailing icon',
        async (type) => {
            // Arrange
            const onClickCallback = vi.fn()
            const leadingIconCallback = vi.fn()
            const trailingIconCallback = vi.fn()
            render(
                <Chip
                    label="label"
                    type={type}
                    leadingIcon={{ iconName: 'leading', onClick: leadingIconCallback }}
                    trailingIcon={{ iconName: 'trailing', onClick: trailingIconCallback }}
                    onClick={onClickCallback}
                />
            )

            // Act
            await user.click(screen.getByRole('button', { name: /^trailing$/i }))

            // Assert
            expect(onClickCallback).not.toHaveBeenCalled()
            expect(leadingIconCallback).not.toHaveBeenCalled()
            expect(trailingIconCallback).toHaveBeenCalledTimes(1)
        }
    )

    test.each([ChipType.FILTER, ChipType.INPUT])(
        'trailign icon callback should not be called when user clicks on trailing icon when chip is disabled',
        async (type) => {
            // Arrange
            const onClickCallback = vi.fn()
            const leadingIconCallback = vi.fn()
            const trailingIconCallback = vi.fn()
            render(
                <Chip
                    label="label"
                    type={type}
                    leadingIcon={{ iconName: 'leading', onClick: leadingIconCallback }}
                    trailingIcon={{ iconName: 'trailing', onClick: trailingIconCallback }}
                    onClick={onClickCallback}
                    disabled={true}
                />
            )

            // Act
            await user.click(screen.getByRole('button', { name: /^trailing$/i }))

            // Assert
            expect(onClickCallback).not.toHaveBeenCalled()
            expect(leadingIconCallback).not.toHaveBeenCalled()
            expect(trailingIconCallback).not.toHaveBeenCalled()
        }
    )

    test.each([ChipType.ASSIST, ChipType.FILTER])(
        'leading icon callback should be called when user clicks on leading icon',
        async (type) => {
            // Arrange
            const onClickCallback = vi.fn()
            const leadingIconCallback = vi.fn()
            const trailingIconCallback = vi.fn()
            render(
                <Chip
                    label="label"
                    type={type}
                    leadingIcon={{ iconName: 'leading', onClick: leadingIconCallback }}
                    trailingIcon={{ iconName: 'trailing', onClick: trailingIconCallback }}
                    onClick={onClickCallback}
                />
            )

            // Act
            await user.click(screen.getByRole('button', { name: /^leading$/i }))

            // Assert
            expect(onClickCallback).not.toHaveBeenCalled()
            expect(leadingIconCallback).toHaveBeenCalledTimes(1)
            expect(trailingIconCallback).not.toHaveBeenCalled()
        }
    )

    test.each([ChipType.ASSIST, ChipType.FILTER])(
        'leading icon callback should not be called when user clicks on leading icon when chip is disabled',
        async (type) => {
            // Arrange
            const onClickCallback = vi.fn()
            const leadingIconCallback = vi.fn()
            const trailingIconCallback = vi.fn()
            render(
                <Chip
                    label="label"
                    type={type}
                    leadingIcon={{ iconName: 'leading', onClick: leadingIconCallback }}
                    trailingIcon={{ iconName: 'trailing', onClick: trailingIconCallback }}
                    onClick={onClickCallback}
                    disabled={true}
                />
            )

            // Act
            await user.click(screen.getByRole('button', { name: /^leading$/i }))

            // Assert
            expect(onClickCallback).not.toHaveBeenCalled()
            expect(leadingIconCallback).not.toHaveBeenCalled()
            expect(trailingIconCallback).not.toHaveBeenCalled()
        }
    )
})

const googleApiMock = defineMockedGoogleApiResponses([])
beforeAll(() => googleApiMock.listen())
afterAll(() => googleApiMock.close())
afterEach(() => googleApiMock.resetHandlers())
