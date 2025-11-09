import defineMockedGoogleApiResponses from '../../mocks/materialSymbolsApi'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { PromptsApiMocker, UserDataEntryMock } from '../../mocks/promptsApi'
import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import PromptList from '../../../src/renderer/src/screens/PromptList'
import userEvent from '@testing-library/user-event'
import App from '../../../src/renderer/src/App'
import { HashRouter } from 'react-router'

describe('first render', () => {
    const user = userEvent.setup()

    test('all prompt files from user data directory should be listed when screen renders for the first time', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act & Assert
        await waitFor(() => {
            const promptListItems = screen.queryAllByRole('listitem')

            expect(promptListItems.length).toBe(3)
            expect(
                promptListItems.some(
                    (element) => !!within(element).queryByText(/python code generator/i)
                )
            ).toBeTruthy()
            expect(
                promptListItems.some(
                    (element) => !!within(element).queryByText(/unit tests generator/i)
                )
            ).toBeTruthy()
            expect(
                promptListItems.some((element) => !!within(element).queryByText(/error analyzer/i))
            ).toBeTruthy()
        })
    })

    test('no prompts message should be shown when screen renders for the first time when user data directory is empty', async () => {
        // Arrange
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(() => {}, { timeout: 1_000 })

        // Assert
        expect(screen.queryAllByRole('listitem').length).toBe(0)
    })

    test('refresh button should be visible when screen renders for the first time', async () => {
        // Arrange
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(() => {}, { timeout: 1_000 })

        // Assert
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()
    })

    test('new prompt button should be visible when screen renders for the first time', async () => {
        // Arrange
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(() => {}, { timeout: 1_000 })

        // Assert
        expect(screen.getByRole('button', { name: /.*new prompt/i })).toBeInTheDocument()
    })

    test('browse files button should be visible when screen renders for the first time', async () => {
        // Arrange
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(() => {}, { timeout: 1_000 })

        // Assert
        expect(screen.getByRole('button', { name: /file_open/i })).toBeInTheDocument()
    })

    test('search bar should be visible when screen renders for the firs t time', async () => {
        // Arrange
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(() => {}, { timeout: 1_000 })

        // Assert
        expect(screen.getByRole('search')).toBeInTheDocument()
    })

    test('edit prompt button should be visible when prompt from list is hovered', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act & Assert
        await waitFor(async () => {
            const promptListItem = screen.queryAllByRole('listitem').pop() as HTMLElement
            await user.hover(promptListItem)

            expect(within(promptListItem).getByRole('button', { name: 'edit' })).toBeInTheDocument()
        })
    })

    test('delete prompt button should be visible when prompt from list is hovered', async () => {
        // Assert
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act & Assert
        await waitFor(async () => {
            const promptListItem = screen.queryAllByRole('listitem').pop() as HTMLElement
            await user.hover(promptListItem)

            expect(
                within(promptListItem).getByRole('button', { name: 'delete' })
            ).toBeInTheDocument()
        })
    })

    test('prompt select checkbox should be visible when prompt from list is hovered', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act & Assert
        await waitFor(async () => {
            const promptListItem = screen.queryAllByRole('listitem').pop() as HTMLElement
            await user.hover(promptListItem)

            expect(within(promptListItem).getByRole('checkbox')).not.toBeChecked()
        })
    })

    test('headers should be visible when screen renders for the first time', async () => {
        // Arrange
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(() => {}, { timeout: 1_000 })

        // Assert
        expect(screen.getByText(/your prompts/i)).toBeInTheDocument()
    })
})

describe('browsing prompts', () => {
    const user = userEvent.setup()

    test('only prompts whose titles include search query should be visible on screen after submit', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await user.type(screen.getByRole('search'), 'Gen{enter}')

        // Assert
        const promptListItems = screen.queryAllByRole('listitem')
        expect(promptListItems.length).toBe(2)
        expect(
            promptListItems.some(
                (element) => !!within(element).queryByText(/python code generator/i)
            )
        ).toBeTruthy()
        expect(
            promptListItems.some(
                (element) => !!within(element).queryByText(/unit tests generator/i)
            )
        ).toBeTruthy()
    })

    test('all prompts should be visible on screen when query is empty', async () => {
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        await user.type(screen.getByRole('search'), '{enter}')

        const promptListItems = screen.queryAllByRole('listitem')
        expect(promptListItems.length).toBe(3)
    })

    test('selected prompts should be visible on screen even when their titles do not include search query', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptListItems = screen
                .queryAllByRole('listitem')
                .filter((element) => !!within(element).queryByText(/unit tests generator/i))
            await user.hover(promptListItems[0])
            await user.pointer({
                target: within(promptListItems[0]).getByRole('checkbox'),
                keys: '[MouseLeft]'
            })
        })
        await user.type(screen.getByRole('search'), 'Err{enter}')

        // Assert
        const filteredPromptListItems = screen.queryAllByRole('listitem')
        expect(filteredPromptListItems.length).toBe(2)
        expect(
            filteredPromptListItems.some(
                (element) => !!within(element).queryByText(/error analyzer/i)
            )
        ).toBeTruthy()
        expect(
            filteredPromptListItems.some(
                (element) => !!within(element).queryByText(/unit tests generator/i)
            )
        ).toBeTruthy()
    })

    test('all prompts should be visible on screen when user submit empty query after the first non-empty query', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(() => {}, { timeout: 1000 })
        await user.type(screen.getByRole('search'), 'Gen{enter}')
        await user.type(screen.getByRole('search'), '{backspace}{backspace}{backspace}{enter}')

        // Assert
        const promptListItems = screen.queryAllByRole('listitem')
        expect(promptListItems.length).toBe(3)
        expect(
            promptListItems.some(
                (element) => !!within(element).queryByText(/python code generator/i)
            )
        ).toBeTruthy()
        expect(
            promptListItems.some(
                (element) => !!within(element).queryByText(/unit tests generator/i)
            )
        ).toBeTruthy()
        expect(
            promptListItems.some((element) => !!within(element).queryByText(/error analyzer/i))
        ).toBeTruthy()
    })
})

describe('refreshing screen', () => {
    const user = userEvent.setup()

    test('search query should be cleared and all prompts from user data directory should be shown when user clicks refresh button', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(() => {}, { timeout: 1000 })
        await user.type(screen.getByRole('search'), 'Err{enter}')
        await user.click(screen.getByRole('button', { name: /Refresh/i }))
        await waitFor(() => {}, { timeout: 1000 })

        // Assert
        const promptListItems = screen.queryAllByRole('listitem')
        const searchField: HTMLInputElement = screen.getByRole('search')

        expect(promptListItems.length).toBe(3)
        expect(
            promptListItems.some(
                (element) => !!within(element).queryByText(/python code generator/i)
            )
        ).toBeTruthy()
        expect(
            promptListItems.some(
                (element) => !!within(element).queryByText(/unit tests generator/i)
            )
        ).toBeTruthy()
        expect(
            promptListItems.some((element) => !!within(element).queryByText(/error analyzer/i))
        ).toBeTruthy()
        expect(searchField.value).toBe('')
    })

    test('all prompts should be unselected when user clicks refresh button', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptListItem = screen.queryAllByRole('listitem')[0]
            await user.hover(promptListItem)
            await user.pointer({
                target: within(promptListItem).getByRole('checkbox'),
                keys: '[MouseLeft]'
            })
            await user.click(screen.getByRole('button', { name: /refresh/i }))
        })

        // Assert
        const promptListItems = screen.queryAllByRole('listitem')
        expect(
            promptListItems.some((item) => {
                const checkbox: HTMLInputElement | null = within(item).queryByRole('checkbox')
                return checkbox ? checkbox.checked : false
            })
        ).toBeFalsy()
    })

    test('changes in user data files should be reflected in prompts list when user clicks refresh button', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(() => {
            screen.getAllByRole('listitem')
        })
        const updatedData = new Map(userDataWithThreePrompts)
        updatedData.set('/user/data/food_recipies_generator', {
            content: '',
            title: 'Food Recipie Generator'
        })
        promptsApiMock.setUserData(updatedData)
        await user.click(screen.getByRole('button', { name: /refresh/i }))
        await waitFor(() => {}, { timeout: 1_000 })

        // Assert
        const promptListItems = screen.getAllByRole('listitem')
        expect(promptListItems.length).toBe(4)
        expect(
            promptListItems.some((item) => !!within(item).queryByText(/food recipie generator/i))
        ).toBeTruthy()
    })
})

describe('screen transitions', () => {
    const user = userEvent.setup()

    test('transition to "Prompt Editor" screen for new prompts should be made when user clicks the new prompt button', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<App />, { wrapper: HashRouter })

        // Act
        await user.click(screen.getByRole('button', { name: /.*new prompt/i }))

        // Assert
        expect(screen.getByText(/prompt editor/i)).toBeInTheDocument()
    })

    test('transition to "Prompt Fill" screen for selected prompt should be made when user clicks on prompt from list in the list mode', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<App />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            await user.click(screen.getAllByRole('listitem')[0])
        })

        // Assert
        expect(screen.getByText(/prompt Filler/i)).toBeInTheDocument()
    })

    test('transition to "Prompt Editor" screen for selected prompt should be made when user clicks prompt edit button and confirms edition in dialog', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<App />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptLisItem = screen.getAllByRole('listitem')[0]
            await user.hover(promptLisItem)
            await user.pointer({
                target: within(promptLisItem).getByRole('button', { name: /edit/i }),
                keys: '[MouseLeft]'
            })
        })
        await waitFor(async () => {
            const dialog = screen.getByRole('dialog')
            await user.click(within(dialog).getByRole('button', { name: /confirm/i }))
        })

        // Assert
        expect(screen.getByText(/prompt editor/i)).toBeInTheDocument()
    })

    test('no transition to "Prompt Editor" screen for selected prompt should be made when user clicks prompt edit button and cancels edition in dialog', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<App />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptLisItem = screen.getAllByRole('listitem')[0]
            await user.hover(promptLisItem)
            await user.pointer({
                target: within(promptLisItem).getByRole('button', { name: /edit/i }),
                keys: '[MouseLeft]'
            })
        })
        await waitFor(async () => {
            const dialog = screen.getByRole('dialog')
            await user.click(within(dialog).getByRole('button', { name: /cancel/i }))
        })

        // Assert
        expect(screen.getByText(/your prompts/i)).toBeInTheDocument()
    })
})

describe('selection mode', () => {
    const user = userEvent.setup()

    const selectOnePrompt = async (): Promise<void> => {
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            await user.hover(promptListItems[0])
            await user.pointer({
                target: within(promptListItems[0]).getByRole('checkbox'),
                keys: '[MouseLeft]'
            })
        })
    }

    const selectTwoPrompts = async (): Promise<void> => {
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            for (const index of [0, 2]) {
                await user.hover(promptListItems[index])
                await user.pointer({
                    target: within(promptListItems[index]).getByRole('checkbox'),
                    keys: '[MouseLeft]'
                })
            }
        })
    }

    const selectAllPromptsWithDedicatedButton = async (): Promise<void> => {
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            await user.hover(promptListItems[0])
            await user.pointer({
                target: within(promptListItems[0]).getByRole('checkbox'),
                keys: '[MouseLeft]'
            })
        })
        await waitFor(async () => {
            await user.click(screen.getByRole('button', { name: /select all/i }))
        })
    }

    const selectTwoPromptsAndDeselectThemUntilOnlyOneIsSelected = async (): Promise<void> => {
        let promptListItems: HTMLElement[] = []

        await waitFor(async () => {
            promptListItems = screen.queryAllByRole('listitem')
            for (const index of [0, 2]) {
                await user.hover(promptListItems[index])
                await user.pointer({
                    target: within(promptListItems[index]).getByRole('checkbox'),
                    keys: '[MouseLeft]'
                })
            }
        })
        await waitFor(async () => {
            await user.hover(promptListItems[0])
            await user.pointer({
                target: within(promptListItems[0]).getByRole('checkbox'),
                keys: '[MouseLeft]'
            })
        })
    }

    const selectTwoPromptsAndDeselectThemAll = async (): Promise<void> => {
        let promptListItems: HTMLElement[] = []
        const selectedIndicies = [0, 2]

        await waitFor(async () => {
            promptListItems = screen.queryAllByRole('listitem')
            for (const index of selectedIndicies) {
                await user.hover(promptListItems[index])
                await user.pointer({
                    target: within(promptListItems[index]).getByRole('checkbox'),
                    keys: '[MouseLeft]'
                })
            }
        })
        await waitFor(async () => {
            for (const index of selectedIndicies) {
                await user.hover(promptListItems[index])
                await user.pointer({
                    target: within(promptListItems[index]).getByRole('checkbox'),
                    keys: '[MouseLeft]'
                })
            }
        })
    }

    const selectMultiplePromptsAndClickCancelButton = async (): Promise<void> => {
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            await Promise.all(
                [0, 2].map(async (index) => {
                    await user.hover(promptListItems[index])
                    await user.pointer({
                        target: within(promptListItems[index]).getByRole('checkbox'),
                        keys: '[MouseLeft]'
                    })
                })
            )
        })
        await waitFor(async () => {
            await user.click(screen.getByRole('button', { name: /cancel/i }))
        })
    }

    test.each([
        [selectOnePrompt, 1],
        [selectTwoPrompts, 2],
        [selectTwoPromptsAndDeselectThemUntilOnlyOneIsSelected, 1],
        [selectAllPromptsWithDedicatedButton, 3]
    ])(
        'prompt should be checked as selected when user clicks the unchecked checkbox on prompt',
        async (userAction, numberOfCheckedPrompts) => {
            // Arrange
            promptsApiMock.setUserData(userDataWithThreePrompts)
            render(<PromptList />, { wrapper: HashRouter })

            // Act
            await userAction()

            // Assert
            const selectedPrompts = screen.queryAllByRole('checkbox', { checked: true }).length
            expect(selectedPrompts).toBe(numberOfCheckedPrompts)
        }
    )

    test.each([
        selectOnePrompt,
        selectTwoPrompts,
        selectTwoPromptsAndDeselectThemUntilOnlyOneIsSelected,
        selectAllPromptsWithDedicatedButton
    ])('select all button should be visible when user has selected prompt', async (userAction) => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await userAction()

        // Assert
        expect(screen.getByRole('button', { name: /select all/i })).toBeInTheDocument()
    })

    test.each([
        selectOnePrompt,
        selectTwoPrompts,
        selectTwoPromptsAndDeselectThemUntilOnlyOneIsSelected,
        selectAllPromptsWithDedicatedButton
    ])(
        'delete selected button should be visible when user has selected prompt',
        async (userAction) => {
            // Arrange
            promptsApiMock.setUserData(userDataWithThreePrompts)
            render(<PromptList />, { wrapper: HashRouter })

            // Act
            await userAction()

            // Assert
            expect(screen.getByRole('button', { name: /.*delete selected/i })).toBeInTheDocument()
        }
    )

    test.each([
        selectOnePrompt,
        selectTwoPrompts,
        selectTwoPromptsAndDeselectThemUntilOnlyOneIsSelected,
        selectAllPromptsWithDedicatedButton
    ])(
        'cancel selected button should be visible when user has selected prompt',
        async (userAction) => {
            // Arrange
            promptsApiMock.setUserData(userDataWithThreePrompts)
            render(<PromptList />, { wrapper: HashRouter })

            // Act
            await userAction()

            // Assert
            expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
        }
    )

    test('prompt should be unchecked when user clicks the checked checkbox on prompt', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })
        let promptListItem: HTMLElement | null = null
        await waitFor(async () => {
            promptListItem = screen.queryAllByRole('listitem')[0]
            await user.hover(promptListItem)
            await user.pointer({
                target: within(promptListItem).getByRole('checkbox'),
                keys: '[MouseLeft]'
            })
        })
        if (!promptListItem) throw Error('Cant find list item')

        // Act
        await waitFor(async () => {
            await user.click(within(promptListItem as HTMLElement).getByRole('checkbox'))
        })

        // Assert
        expect(within(promptListItem).getByRole('checkbox', { checked: false }))
    })

    test.each([selectTwoPromptsAndDeselectThemAll, selectMultiplePromptsAndClickCancelButton])(
        'select all button should not be visible when no prompts are selected',
        async (userAction) => {
            // Arrange
            promptsApiMock.setUserData(userDataWithThreePrompts)
            render(<PromptList />, { wrapper: HashRouter })

            // Act
            await userAction()

            // Assert
            expect(screen.queryByRole('button', { name: /select all/i })).not.toBeInTheDocument()
        }
    )

    test.each([selectTwoPromptsAndDeselectThemAll, selectMultiplePromptsAndClickCancelButton])(
        'delete selected button should not be visible when no prompts are selected',
        async (userAction) => {
            // Arrange
            promptsApiMock.setUserData(userDataWithThreePrompts)
            render(<PromptList />, { wrapper: HashRouter })

            // Act
            await userAction()

            // Assert
            expect(
                screen.queryByRole('button', { name: /.*delete selected/i })
            ).not.toBeInTheDocument()
        }
    )

    test.each([selectTwoPromptsAndDeselectThemAll, selectMultiplePromptsAndClickCancelButton])(
        'cancel button should not be visible when no prompts are selected',
        async (userAction) => {
            // Arrange
            promptsApiMock.setUserData(userDataWithThreePrompts)
            render(<PromptList />, { wrapper: HashRouter })

            // Act
            await userAction()

            // Assert
            expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
        }
    )

    test.each([
        selectOnePrompt,
        selectTwoPrompts,
        selectTwoPromptsAndDeselectThemUntilOnlyOneIsSelected,
        selectAllPromptsWithDedicatedButton
    ])(
        'no transition to "Prompt Fill" screen should happen when user clicks prompt while any other prompt is selected',
        async (userAction) => {
            // Arrange
            promptsApiMock.setUserData(userDataWithThreePrompts)
            render(<PromptList />, { wrapper: HashRouter })

            // Act
            await userAction()
            await user.click(screen.queryAllByRole('listitem')[0])

            // Assert
            expect(screen.queryByText(/prompt filler/i)).not.toBeInTheDocument()
        }
    )

    test.each([
        selectOnePrompt,
        selectTwoPrompts,
        selectTwoPromptsAndDeselectThemUntilOnlyOneIsSelected,
        selectAllPromptsWithDedicatedButton
    ])(
        'no edit nor remove buttons should appear on prompt while its hovered and while other prompt is selected',
        async (userAction) => {
            // Arrange
            promptsApiMock.setUserData(userDataWithThreePrompts)
            render(<PromptList />, { wrapper: HashRouter })

            // Act
            await userAction()

            // Assert
            const promptListItems = screen.queryAllByRole('listitem')
            for (const prompt of promptListItems) {
                await user.click(prompt)
                expect(
                    within(prompt).queryByRole('button', { name: /edit/i })
                ).not.toBeInTheDocument()
                expect(
                    within(prompt).queryByRole('button', { name: /delete/i })
                ).not.toBeInTheDocument()
            }
        }
    )
})

describe('dialogs rendering', () => {
    const user = userEvent.setup()

    test('delete confirmation dialog should be shown when user clicks delete button', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            await user.hover(promptListItems[0])
            await user.pointer({
                target: within(promptListItems[0]).getByRole('button', { name: /delete/i }),
                keys: '[MouseLeft]'
            })
        })

        // Assert
        expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    test('delete confirmation dialog should be shown when user clicks delete selected button', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            await user.hover(promptListItems[0])
            await user.pointer({
                target: within(promptListItems[0]).getByRole('checkbox'),
                keys: '[MouseLeft]'
            })
        })
        await waitFor(async () => {
            await user.click(screen.getByRole('button', { name: /.*delete selected/i }))
        })

        // Assert
        expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    test('edit confirmation dialog should be shown when user clicks edit button', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            await user.hover(promptListItems[0])
            await user.pointer({
                target: within(promptListItems[0]).getByRole('button', { name: /edit/i }),
                keys: '[MouseLeft]'
            })
        })

        // Assert
        expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
})

describe('deleting prompts', () => {
    const user = userEvent.setup()

    test('prompt file should be deleted when user clicks delete button and confirms in dialog', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            await user.hover(promptListItems[0])
            await user.pointer({
                target: within(promptListItems[0]).getByRole('button', { name: /delete/i }),
                keys: '[MouseLeft]'
            })
        })
        await waitFor(async () => {
            const dialog = screen.getByRole('dialog')
            await user.click(within(dialog).getByRole('button', { name: /confirm/i }))
        })

        // Assert
        expect(screen.queryAllByRole('listitem').length).toBe(2)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    test('prompt file should not be deleted when user clicks delete button and cancels in dialog', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            await user.hover(promptListItems[0])
            await user.pointer({
                target: within(promptListItems[0]).getByRole('button', { name: /delete/i }),
                keys: '[MouseLeft]'
            })
        })
        await waitFor(async () => {
            const dialog = screen.getByRole('dialog')
            await user.click(within(dialog).getByRole('button', { name: /cancel/i }))
        })

        // Assert
        expect(screen.queryAllByRole('listitem').length).toBe(3)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    test('prompt files of all selected prompts should be deleted when user clicks delete selected button and confirms in dialog', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            for (const index of [0, 2]) {
                await user.hover(promptListItems[index])
                await user.pointer({
                    target: within(promptListItems[index]).getByRole('checkbox'),
                    keys: '[MouseLeft]'
                })
            }
        })
        await waitFor(async () => {
            await user.click(screen.getByRole('button', { name: /.*delete selected/i }))
        })
        await waitFor(async () => {
            const dialog = screen.getByRole('dialog')
            await user.click(within(dialog).getByRole('button', { name: /confirm/i }))
        })

        // Assert
        expect(screen.queryAllByRole('listitem').length).toBe(1)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    test('prompt files of all selected prompts should not be deleted when user clicks delete selected button and cancels in dialog', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            for (const index of [0, 2]) {
                await user.hover(promptListItems[index])
                await user.pointer({
                    target: within(promptListItems[index]).getByRole('checkbox'),
                    keys: '[MouseLeft]'
                })
            }
        })
        await waitFor(async () => {
            await user.click(screen.getByRole('button', { name: /.*delete selected/i }))
        })
        await waitFor(async () => {
            const dialog = screen.getByRole('dialog')
            await user.click(within(dialog).getByRole('button', { name: /cancel/i }))
        })

        // Assert
        expect(screen.queryAllByRole('listitem').length).toBe(3)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    test('error message should be shown when deletion of prompt file via the delete button failed', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            await user.hover(promptListItems[0])
            await user.pointer({
                target: within(promptListItems[0]).getByRole('button', { name: /delete/i }),
                keys: '[MouseLeft]'
            })
        })
        promptsApiMock.setUserData(new Map())
        await waitFor(async () => {
            const dialog = screen.getByRole('dialog')
            await user.click(within(dialog).getByRole('button', { name: /confirm/i }))
        })

        // Assert
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    test('error message should be shown when deletion of prompts files via the delete selected button failed', async () => {
        // Arrange
        promptsApiMock.setUserData(userDataWithThreePrompts)
        render(<PromptList />, { wrapper: HashRouter })

        // Act
        await waitFor(async () => {
            const promptListItems = screen.queryAllByRole('listitem')
            for (const index of [0, 2]) {
                await user.hover(promptListItems[index])
                await user.pointer({
                    target: within(promptListItems[index]).getByRole('checkbox'),
                    keys: '[MouseLeft]'
                })
            }
        })
        await waitFor(async () => {
            await user.click(screen.getByRole('button', { name: /.*delete selected/i }))
        })
        promptsApiMock.setUserData(new Map())
        await waitFor(async () => {
            const dialog = screen.getByRole('dialog')
            await user.click(within(dialog).getByRole('button', { name: /confirm/i }))
        })
        await waitFor(() => {}, { timeout: 1000 })

        // Assert
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })
})

const materialIconsApiMock = defineMockedGoogleApiResponses([])
const promptsApiMock = new PromptsApiMocker()
const userDataWithThreePrompts = new Map<string, UserDataEntryMock>([
    ['/data/user/python_code_generator.md', { content: '', title: 'Python Code Generator' }],
    ['/data/user/ut-generator.md', { content: '', title: 'Unit Tests Generator' }],
    ['/data/user/error-analyzer.md', { content: '', title: 'Error Analyzer' }]
])

beforeAll(() => {
    materialIconsApiMock.listen()
})

beforeEach(() => {
    promptsApiMock.start()
    window.location.hash = '#/'
})

afterEach(() => {
    materialIconsApiMock.resetHandlers()
    promptsApiMock.reset()
})

afterAll(() => {
    materialIconsApiMock.close()
})
