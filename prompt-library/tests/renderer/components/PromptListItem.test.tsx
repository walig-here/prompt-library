import { render, screen } from '@testing-library/react'
import defineMockedGoogleApiResponses from '../../mocks/materialSymbolsApi'
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import PromptListItem from '../../../src/renderer/src/components/PromptListItem'
import { PromptListItemMode } from '../../../src/renderer/src/components/props/PromptItemProps'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'

describe('mode-driven rendering', () => {
    const user = userEvent.setup()

    // SELECTABLE
    test('action buttons and checkbox should be invisible when selectable component is not hovered', () => {
        renderWithMode(PromptListItemMode.SELECTABLE)

        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })

    test('action buttons and checkbox should be visible when selectable component is hovered', async () => {
        renderWithMode(PromptListItemMode.SELECTABLE)

        await user.hover(screen.getByText(/title/i))

        expect(screen.queryByText(/edit/i)).toBeInTheDocument()
        expect(screen.queryByText(/delete/i)).toBeInTheDocument()
        expect(screen.queryByRole('checkbox')).toBeInTheDocument()
    })

    test('action buttons and checkbox should be visible when selectable component is unhovered', async () => {
        renderWithMode(PromptListItemMode.SELECTABLE)

        const promptListItem = screen.getByText(/title/i)
        await user.hover(promptListItem)
        await user.unhover(promptListItem)

        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })

    // SELECTED
    test('action buttons should be invisible and seleced checkbox should be visible when not hovered component is selected', () => {
        renderWithMode(PromptListItemMode.SELECTED)

        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('checkbox')).toBeChecked()
    })

    test('action buttons should be invisible and seleced checkbox should be visible when hovered component is selected', async () => {
        renderWithMode(PromptListItemMode.SELECTED)

        await user.hover(screen.getByText(/title/i))

        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('checkbox')).toBeChecked()
    })

    test('action buttons should be invisible and seleced checkbox should be visible when unhovered component is selected', async () => {
        renderWithMode(PromptListItemMode.SELECTED)

        const promptListItem = screen.getByText(/title/i)
        await user.hover(promptListItem)
        await user.unhover(promptListItem)

        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('checkbox')).toBeChecked()
    })

    // DESELECTED
    test('action buttons should be invisible and unselected checkbox should be visible when hovered component is deselected', () => {
        renderWithMode(PromptListItemMode.DESELECTED)

        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('checkbox')).not.toBeChecked()
    })

    test('action buttons should be invisible and unselected checkbox should be visible when not hovered component is deselected', async () => {
        renderWithMode(PromptListItemMode.DESELECTED)

        await user.hover(screen.getByText(/title/i))

        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('checkbox')).not.toBeChecked()
    })

    test('action buttons should be invisible and unselected checkbox should be visible when not unhovered component is deselected', async () => {
        renderWithMode(PromptListItemMode.DESELECTED)

        const promptListItem = screen.getByText(/title/i)
        await user.hover(promptListItem)
        await user.unhover(promptListItem)

        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('checkbox')).not.toBeChecked()
    })
})

describe('prompt data presentation', () => {
    test('prompt name and file path should be rendered when component is rendered', () => {
        renderWithMode(PromptListItemMode.SELECTABLE)

        expect(screen.getByText(/title/i)).toBeInTheDocument()
        expect(screen.getByText(/file\.txt/i)).toBeInTheDocument()
    })
})

describe('user interactions', () => {
    const user = userEvent.setup()
    const clickCallback = vi.fn()
    const editCallback = vi.fn()
    const removeCallback = vi.fn()
    const selectCallback = vi.fn()

    beforeEach(() => {
        clickCallback.mockClear()
        editCallback.mockClear()
        removeCallback.mockClear()
        selectCallback.mockClear()
    })

    test('main callback should be called when user clicks on component in the selectable mode', async () => {
        renderWithMode(
            PromptListItemMode.SELECTABLE,
            clickCallback,
            editCallback,
            removeCallback,
            selectCallback
        )

        await user.click(screen.getByText(/title/i))

        expect(clickCallback).toHaveBeenCalledOnce()
        expect(editCallback).not.toHaveBeenCalled()
        expect(removeCallback).not.toHaveBeenCalled()
        expect(selectCallback).not.toHaveBeenCalled()
    })

    test('edit callback should be called when user clicks on edit button', async () => {
        renderWithMode(
            PromptListItemMode.SELECTABLE,
            clickCallback,
            editCallback,
            removeCallback,
            selectCallback
        )

        await user.hover(screen.getByText(/title/i))
        await user.pointer({
            target: screen.getByRole('button', { name: 'edit' }),
            keys: '[MouseLeft]'
        })

        expect(clickCallback).not.toHaveBeenCalled()
        expect(editCallback).toHaveBeenCalledOnce()
        expect(removeCallback).not.toHaveBeenCalled()
        expect(selectCallback).not.toHaveBeenCalled()
    })

    test('remove callback should be called when user clicks on remove button', async () => {
        renderWithMode(
            PromptListItemMode.SELECTABLE,
            clickCallback,
            editCallback,
            removeCallback,
            selectCallback
        )

        await user.hover(screen.getByText(/title/i))
        await user.pointer({
            target: screen.getByRole('button', { name: 'delete' }),
            keys: '[MouseLeft]'
        })

        expect(clickCallback).not.toHaveBeenCalled()
        expect(editCallback).not.toHaveBeenCalledOnce()
        expect(removeCallback).toHaveBeenCalledOnce()
        expect(selectCallback).not.toHaveBeenCalled()
    })

    test('selection callback should be called when user changes selection of the checkbox', async () => {
        renderWithMode(
            PromptListItemMode.SELECTABLE,
            clickCallback,
            editCallback,
            removeCallback,
            selectCallback
        )

        await user.hover(screen.getByText(/title/i))
        await user.pointer({ target: screen.getByRole('checkbox'), keys: '[MouseLeft]' })

        expect(clickCallback).not.toHaveBeenCalled()
        expect(editCallback).not.toHaveBeenCalledOnce()
        expect(removeCallback).not.toHaveBeenCalledOnce()
        expect(selectCallback).toHaveBeenCalledOnce()
    })

    test('click callback should not be called when user clicks on component in selected mode', async () => {
        renderWithMode(
            PromptListItemMode.SELECTED,
            clickCallback,
            editCallback,
            removeCallback,
            selectCallback
        )

        await user.click(screen.getByText(/title/i))

        expect(clickCallback).not.toHaveBeenCalled()
        expect(editCallback).not.toHaveBeenCalled()
        expect(removeCallback).not.toHaveBeenCalled()
        expect(selectCallback).not.toHaveBeenCalled()
    })

    test('click callback should not be called when user clicks on component in deselected mode', async () => {
        renderWithMode(
            PromptListItemMode.DESELECTED,
            clickCallback,
            editCallback,
            removeCallback,
            selectCallback
        )

        await user.click(screen.getByText(/title/i))

        expect(clickCallback).not.toHaveBeenCalled()
        expect(editCallback).not.toHaveBeenCalled()
        expect(removeCallback).not.toHaveBeenCalled()
        expect(selectCallback).not.toHaveBeenCalled()
    })
})

const googleMaterialSymbolsApiMock = defineMockedGoogleApiResponses([])

beforeAll(() => {
    googleMaterialSymbolsApiMock.listen()
})
afterAll(() => {
    googleMaterialSymbolsApiMock.close()
})
beforeEach(() => {
    googleMaterialSymbolsApiMock.resetHandlers()
})

const renderWithMode = (
    mode: PromptListItemMode,
    clickCallback?: (promptFilePatt: string) => void,
    editCallback?: (promtFilePath: string) => void,
    removeCallback?: (promptFilePath: string) => void,
    selectionCallback?: React.ChangeEventHandler<HTMLInputElement>
): void => {
    render(
        <PromptListItem
            mode={mode}
            onClick={clickCallback}
            onEditClick={editCallback}
            onRemoveClick={removeCallback}
            onSelectionChanged={selectionCallback}
            promptFilePath="/file.txt"
            title="title"
        />
    )
}
