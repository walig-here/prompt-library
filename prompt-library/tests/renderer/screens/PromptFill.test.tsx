import { createMemoryHistory, MemoryHistory } from 'history'
import { testWithAssets } from '../../fixtures/fixtures'
import { beforeEach, describe, expect } from 'vitest'
import { PromptsApiMocker, UserDataEntryMock } from '../../mocks/promptsApi'
import { afterEach } from 'node:test'
import { MemoryRouter } from 'react-router'
import App from '../../../src/renderer/src/App'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent, { UserEvent } from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'

describe('first render', () => {
    describe.each([
        promptWithMultiplePlaceholdersPath,
        promptWithOnePlaceholderPath,
        promptWithPlaceholderThatOccursManyTimes
    ])('with param: %s', (promptPath) => {
        testWithAssets(
            'header, cancel, show preview & confirm buttons are shown when screen renders for the first time and has placeholders',
            async ({ readAsset }) => {
                // Arrange & Act
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Assert
                expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument()
                expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
                expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument()
                expect(screen.getByText(/prompt filler/i)).toBeInTheDocument()
            }
        )
    })

    describe.each([promptWithNoPlaceholdersPath, invalidPlaceholderPath])(
        'with param: %s',
        (promptPath) => {
            testWithAssets(
                'header, cancel, hide preview & confirm buttons are shown when screen render for the first time and has no placeholder',
                async ({ readAsset }) => {
                    // Arrange & Act
                    await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                    // Assert
                    expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument()
                    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
                    expect(screen.getByRole('button', { name: /preview_off/i })).toBeInTheDocument()
                    expect(screen.getByText(/prompt filler/i)).toBeInTheDocument()
                }
            )
        }
    )

    describe.each([
        promptWithMultiplePlaceholdersPath,
        promptWithOnePlaceholderPath,
        promptWithPlaceholderThatOccursManyTimes
    ])('with param: %s', (promptPath) => {
        testWithAssets(
            'no preview panel is visible when screen renders for the first time',
            async ({ readAsset }) => {
                // Arrange & Act
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Assert
                const expectedContent = readAsset(`prompts/${promptPath}`)
                    .toString()
                    .replaceAll(/\${.*}/gi, '\\${.*}')
                expect(screen.queryByText(/Preview/)).not.toBeInTheDocument()
                expect(
                    screen.queryByText((_, element) =>
                        _getGetPreviewByText(element, expectedContent)
                    )
                ).not.toBeInTheDocument()
            }
        )
    })

    describe.each([promptWithNoPlaceholdersPath, invalidPlaceholderPath])(
        'with param: %s',
        (promptPath) => {
            testWithAssets(
                'preview panel is visible when screen renders for the first time and prompt has placeholders',
                async ({ readAsset }) => {
                    // Arrange & Act
                    await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                    // Assert
                    const expectedContent = readAsset(`prompts/${promptPath}`).toString()
                    expect(screen.getByText(/Preview/)).toBeInTheDocument()
                    expect(
                        screen.getByText((_, element) =>
                            _getGetPreviewByText(element, expectedContent)
                        )
                    ).toBeInTheDocument()
                }
            )
        }
    )

    describe.each([
        [promptWithMultiplePlaceholdersPath, ['CODE 1', 'INSTRUCTIONS']],
        [promptWithNoPlaceholdersPath, []],
        [promptWithOnePlaceholderPath, ['DOCUMENT']],
        [promptWithPlaceholderThatOccursManyTimes, ['PLACEHOLDER']]
    ])('with param: %s', (promptPath, expectedPlaceholders) => {
        testWithAssets(
            'inputs for all placeholders are rendered when screen renders for the first time',
            async ({ readAsset }) => {
                // Arrange & Act
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Assert
                expectedPlaceholders.forEach((expectedPlaceholder) =>
                    expect(getFormItemByLabel(new RegExp(`^${expectedPlaceholder}`)))
                )
            }
        )
    })
})

describe('preview', () => {
    const user = userEvent.setup()

    describe.each([
        [promptWithMultiplePlaceholdersPath, 'CODE 1'],
        [promptWithOnePlaceholderPath, 'DOCUMENT'],
        [promptWithPlaceholderThatOccursManyTimes, 'PLACEHOLDER']
    ])('with param: %s', (promptPath, editedPromptName) => {
        testWithAssets(
            'placeholders should be replaced with values from inputs when user fills inputs',
            async ({ readAsset }) => {
                // Assert
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Act
                await openPreview(user)
                await user.type(
                    within(getFormItemByLabel(new RegExp(editedPromptName))).getByRole('textbox'),
                    'xyz'
                )

                // Assert
                expect(
                    screen.queryByText((_, element) =>
                        _getGetPreviewByText(
                            element,
                            readAsset(`prompts/${promptPath}`)
                                .toString()
                                .replaceAll(`\${${editedPromptName}}`, 'xyz')
                        )
                    )
                ).toBeInTheDocument()
            }
        )
    })

    describe.each([
        promptWithMultiplePlaceholdersPath,
        promptWithOnePlaceholderPath,
        promptWithPlaceholderThatOccursManyTimes
    ])('with param: %s', (promptPath) => {
        testWithAssets(
            'placeholders should be directly displayed when user has not yet filled inputes',
            async ({ readAsset }) => {
                // Assert
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Act
                await openPreview(user)

                // Assert
                expect(
                    screen.queryByText((_, element) =>
                        _getGetPreviewByText(element, readAsset(`prompts/${promptPath}`).toString())
                    )
                ).toBeInTheDocument()
            }
        )
    })

    testWithAssets(
        'just prompt content should be displayed in the preview when prompt has no placeholders',
        async ({ readAsset }) => {
            // Assert & Act
            await renderPromptFiller(readAsset, `?prompt=${promptWithNoPlaceholdersPath}`)

            // Assert
            expect(
                screen.queryByText((_, element) =>
                    _getGetPreviewByText(
                        element,
                        readAsset(`prompts/${promptWithNoPlaceholdersPath}`).toString()
                    )
                )
            ).toBeInTheDocument()
        }
    )
})

describe('validation', () => {
    describe.each([
        [promptWithMultiplePlaceholdersPath, 2],
        [promptWithOnePlaceholderPath, 1],
        [promptWithPlaceholderThatOccursManyTimes, 1]
    ])('with param: %s', (promptPath, numberOfErrors) => {
        testWithAssets(
            'error message should appear when any input is empty',
            async ({ readAsset }) => {
                // Assert & Act
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Assert
                expect(screen.getAllByText(/must be filled/i).length).toBe(numberOfErrors)
            }
        )
    })

    describe.each([
        [promptWithMultiplePlaceholdersPath, ['CODE 1', 'INSTRUCTIONS']],
        [promptWithOnePlaceholderPath, ['DOCUMENT']],
        [promptWithPlaceholderThatOccursManyTimes, ['PLACEHOLDER']]
    ])('with param: %s', (promptPath, placeholders) => {
        testWithAssets(
            'error message should not appear when no input is empty',
            async ({ readAsset }) => {
                // Assert
                const user = userEvent.setup()
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Act
                await openPreview(user)
                for (const placeholder of placeholders) {
                    await user.type(
                        within(getFormItemByLabel(new RegExp(placeholder))).getByRole('textbox'),
                        `xyz`
                    )
                }

                // Assert
                expect(screen.queryAllByText(/must be filled/i).length).toBe(0)
            }
        )
    })
})

describe('user interactions', () => {
    const user = userEvent.setup()

    describe.each([
        [promptWithMultiplePlaceholdersPath, null],
        [promptWithNoPlaceholdersPath, closePreview],
        [promptWithOnePlaceholderPath, null],
        [promptWithPlaceholderThatOccursManyTimes, null]
    ])('with param: %s', (promptPath, userSetupAction) => {
        testWithAssets(
            'preview panel should appear when user clicks show preview button',
            async ({ readAsset }) => {
                // Assert
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)
                userSetupAction && (await userSetupAction(user))

                // Act
                await openPreview(user)

                // Assert
                expect(screen.getByText(/^Preview/)).toBeInTheDocument()
            }
        )
    })

    describe.each([
        [promptWithMultiplePlaceholdersPath, openPreview],
        [promptWithNoPlaceholdersPath, null],
        [promptWithOnePlaceholderPath, openPreview],
        [promptWithPlaceholderThatOccursManyTimes, openPreview]
    ])('with param: %s', (promptPath, userSetupAction) => {
        testWithAssets(
            'preview panel should disappear when user clicks hide preview button',
            async ({ readAsset }) => {
                // Assert
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)
                userSetupAction && (await userSetupAction(user))

                // Act
                await closePreview(user)

                // Assert
                expect(screen.queryByText(/^Preview/)).not.toBeInTheDocument()
            }
        )
    })

    describe.each([
        [
            promptWithMultiplePlaceholdersPath,
            new Map([
                ['CODE 1', 'foo = 1'],
                ['INSTRUCTIONS', '- instrcuctions']
            ])
        ],
        [promptWithNoPlaceholdersPath, new Map()],
        [promptWithOnePlaceholderPath, new Map([['DOCUMENT', 'doc']])],
        [promptWithPlaceholderThatOccursManyTimes, new Map([['PLACEHOLDER', 'abc']])]
    ])('with param: %s', (promptPath, placeholdersData: Map<string, string>) => {
        testWithAssets(
            'filled prompt should be copied to clipboard when user clicks confirms button and all validations pass',
            async ({ readAsset }) => {
                // Arrange
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Act
                await waitFor(
                    async () => {
                        for (const [placeholderName, placeholderValue] of placeholdersData) {
                            const input = within(
                                getFormItemByLabel(new RegExp(placeholderName))
                            ).getByRole('textbox')
                            await user.type(input, placeholderValue)
                        }
                        await user.click(screen.getByRole('button', { name: /.*confirm/i }))
                    },
                    { timeout: 1_000 }
                )
                await waitFor(() => {}, { timeout: 1_000 })

                // Assert
                let expectedPrompt = readAsset(`prompts/${promptPath}`).toString()
                for (const [placeholderName, placeholderValue] of placeholdersData) {
                    expectedPrompt = expectedPrompt.replaceAll(
                        `\${${placeholderName}}`,
                        placeholderValue
                    )
                }
                expect(await navigator.clipboard.readText()).toBe(expectedPrompt)
            }
        )
    })

    describe.each([
        promptWithMultiplePlaceholdersPath,
        promptWithOnePlaceholderPath,
        promptWithPlaceholderThatOccursManyTimes
    ])('with param: %s', (promptPath) => {
        testWithAssets(
            'filled prompt should not be copied to clipboard when user clicks confirms button and any validations fails',
            async ({ readAsset }) => {
                // Arrange
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Act
                await user.click(screen.getByRole('button', { name: /.*confirm/i }))
                await waitFor(() => {}, { timeout: 1_000 })

                // Assert
                expect(await navigator.clipboard.readText()).toBe('')
            }
        )
    })
})

describe('navigation', () => {
    const user = userEvent.setup()

    describe.each([
        promptWithMultiplePlaceholdersPath,
        promptWithNoPlaceholdersPath,
        promptWithOnePlaceholderPath,
        promptWithPlaceholderThatOccursManyTimes
    ])('with param: %s', (promptPath) => {
        testWithAssets(
            'user should be navigated to the prompt list screen when user clicks cancel button',
            async ({ readAsset }) => {
                // Arrange
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Act
                await user.click(screen.getByRole('button', { name: /^Cancel/ }))
                await waitFor(() => {}, { timeout: 1_000 })

                // Assert
                expect(screen.getByText(/Your Prompts/)).toBeInTheDocument()
            }
        )
    })

    describe.each([
        [
            promptWithMultiplePlaceholdersPath,
            new Map([
                ['CODE 1', 'foo = 1'],
                ['INSTRUCTIONS', '- instrcuctions']
            ])
        ],
        [promptWithNoPlaceholdersPath, new Map()],
        [promptWithOnePlaceholderPath, new Map([['DOCUMENT', 'doc']])],
        [promptWithPlaceholderThatOccursManyTimes, new Map([['PLACEHOLDER', 'abc']])]
    ])('with param: %s', (promptPath, placeholdersData: Map<string, string>) => {
        testWithAssets(
            'user should be navigated to the prompt list screen when user clicks confirm button and all validations passed',
            async ({ readAsset }) => {
                // Arrange
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Act
                for (const [placeholderName, placeholderValue] of placeholdersData) {
                    const input = within(getFormItemByLabel(new RegExp(placeholderName))).getByRole(
                        'textbox'
                    )
                    await user.type(input, placeholderValue)
                }
                await user.click(screen.getByRole('button', { name: /.*confirm/i }))
                await waitFor(() => {}, { timeout: 1_000 })

                // Assert
                expect(screen.getByText(/Your Prompts/)).toBeInTheDocument()
            }
        )
    })

    describe.each([
        promptWithMultiplePlaceholdersPath,
        promptWithOnePlaceholderPath,
        promptWithPlaceholderThatOccursManyTimes
    ])('with param: %s', (promptPath) => {
        testWithAssets(
            'user should not be navigated to the prompt list screen when user clicks confirm button and any validation failed',
            async ({ readAsset }) => {
                // Arrange
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Act
                await user.click(screen.getByRole('button', { name: /.*confirm/i }))
                await waitFor(() => {}, { timeout: 1_000 })

                // Assert
                expect(screen.queryByText(/Your Prompts/)).not.toBeInTheDocument()
            }
        )
    })

    describe.each(['not-existing.md', ''])('with param: %s', (promptPath) => {
        testWithAssets(
            'user should be navigated to the prompt list screen when filled prompt does not exist',
            async ({ readAsset }) => {
                // Arrange
                await renderPromptFiller(readAsset, `?prompt=${promptPath}`)

                // Act
                await waitFor(() => {}, { timeout: 2_000 })

                // Assert
                expect(screen.getByText(/Your Prompts/)).toBeInTheDocument()
            }
        )
    })
})

const promptWithNoPlaceholdersPath = 'prompt1.md'
const invalidPlaceholderPath = 'invalid-placeholder.md'
const promptWithOnePlaceholderPath = 'one-placeholder.md'
const promptWithMultiplePlaceholdersPath = 'multiple-placeholders.md'
const promptWithPlaceholderThatOccursManyTimes = 'placeholder-that-occurrs-many-times.md'

let history: MemoryHistory
const promptsApiMock = new PromptsApiMocker()

beforeEach(() => {
    history = createMemoryHistory()
    history.push('/')

    promptsApiMock.start()
})

afterEach(() => {
    promptsApiMock.reset()
})

async function renderPromptFiller(
    assetsLoader: (assetKey: string) => Buffer,
    urlParam: string = ''
): Promise<void> {
    const promptsNames = [
        promptWithMultiplePlaceholdersPath,
        invalidPlaceholderPath,
        promptWithNoPlaceholdersPath,
        promptWithOnePlaceholderPath,
        promptWithPlaceholderThatOccursManyTimes
    ]
    promptsApiMock.setUserData(
        new Map(
            promptsNames.map((promptPath) => [
                promptPath,
                {
                    content: assetsLoader(`prompts/${promptPath}`).toString(),
                    title: promptPath.split('.')[0]
                } as UserDataEntryMock
            ])
        )
    )

    render(
        <MemoryRouter initialEntries={[`/filler${urlParam}`]}>
            <App />
        </MemoryRouter>
    )

    await waitFor(() => {}, { timeout: 1_000 })
}

async function openPreview(user: UserEvent): Promise<void> {
    await user.click(screen.getByRole('button', { name: /^preview$/ }))
}

async function closePreview(user: UserEvent): Promise<void> {
    await user.click(screen.getByRole('button', { name: /^preview_off$/ }))
}

function getFormItemByLabel(label: RegExp): HTMLElement {
    const formItems = screen.getAllByRole('form')
    const itemsWithTargetLabel = formItems.filter(
        (formItem) => within(formItem).queryAllByText(label).length > 0
    )

    if (itemsWithTargetLabel.length > 1) {
        screen.debug(itemsWithTargetLabel)
        throw new Error(`Found more than one matching form item for label '${label}'`)
    }
    return itemsWithTargetLabel[0]
}

function _getGetPreviewByText(element: Element | null, expectedContent: string): boolean {
    if (!element || element.children.length > 0) return false
    const text = element?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    const expected = expectedContent.replace(/\s+/g, ' ').trim()
    return text === expected
}
