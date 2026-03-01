import { render, screen, within } from '@testing-library/react'
import defineMockedGoogleApiResponses from '../../mocks/materialSymbolsApi'
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import PlaceholdersList from '../../../src/renderer/src/components/PlaceholdersList'
import { PlaceholderData } from '../../../src/renderer/src/components/props/PlaceholdersListProps'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'

describe('rendering', () => {
    const headerContent = /detected placeholders/i

    test.each([[['placeholder 1', 'placeholder 2', 'placeholder 3']], [['placeholder 1']]])(
        'header and all placeholder are displayed when a set of placeholders is passed',
        (placeholders) => {
            // Arrange & Act
            render(
                <PlaceholdersList
                    placeholders={
                        new Set<PlaceholderData>(placeholders.map((name) => ({ name: name })))
                    }
                />
            )

            // Assert
            expect(screen.getByText(headerContent)).toBeInTheDocument()
            expect(screen.getAllByRole('button', { name: /placeholder \d/ }).length).toBe(
                placeholders.length
            )
        }
    )

    test('header and no placeholders are displayed when an empty set of placeholders is passed', () => {
        // Arrange & Act
        render(<PlaceholdersList placeholders={new Set<PlaceholderData>()} />)

        // Assert
        expect(screen.getByText(headerContent)).toBeInTheDocument()
        expect(screen.queryAllByRole('button', { name: /placeholder \d/ }).length).toBe(0)
    })
})

describe('user interactions', () => {
    const user = userEvent.setup()

    test.each([[['placeholder 1', 'placeholder 2', 'placeholder 3']], [['placeholder 1']]])(
        'callback is called for each placeholder would run when user clicks on button on each placeholder',
        async (placeholders) => {
            // Arragne
            const interactionCallback = vi.fn()
            render(
                <PlaceholdersList
                    placeholders={
                        new Set<PlaceholderData>(placeholders.map((name) => ({ name: name })))
                    }
                    placeholderInteraction={{ iconName: 'add', callback: interactionCallback }}
                />
            )

            // Act
            for (const placeholder of placeholders) {
                await user.click(
                    within(
                        screen.getByRole('button', { name: new RegExp(`${placeholder}`) })
                    ).getByRole('button', { name: /add/i })
                )
            }

            // Assert
            expect(interactionCallback).toBeCalledTimes(placeholders.length)
            placeholders.forEach((placeholder) =>
                expect(interactionCallback).toBeCalledWith({ name: placeholder })
            )
        }
    )

    test('callback is called for one placeholder when user clicks on button on one of placeholders', async () => {
        // Arragne
        const interactionCallback = vi.fn()
        render(
            <PlaceholdersList
                placeholders={
                    new Set([
                        { name: 'placeholder 1' },
                        { name: 'placeholder 2' },
                        { name: 'placeholder 3' }
                    ])
                }
                placeholderInteraction={{ iconName: 'add', callback: interactionCallback }}
            />
        )

        // Act
        await user.click(
            within(screen.getByRole('button', { name: /placeholder 2/i })).getByRole('button', {
                name: /add/i
            })
        )

        // Assert
        expect(interactionCallback).toBeCalledTimes(1)
        expect(interactionCallback).toBeCalledWith({ name: 'placeholder 2' })
    })
})

const googleApiMock = defineMockedGoogleApiResponses([])
beforeAll(() => googleApiMock.listen())
afterAll(() => googleApiMock.close())
afterEach(() => googleApiMock.resetHandlers())
