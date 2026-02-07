import React, { useEffect, useMemo, useState } from 'react'
import Text from '../components/Text'
import { TextSize, TextType } from '../components/props/TextProps'
import Button from '../components/Button'
import {
    ButtonColor,
    ButtonShape,
    ButtonSize,
    IconButtonColor
} from '../components/props/ButtonProps'
import '../assets/screens/PromptList.css'
import IconButton from '../components/IconButton'
import SearchBar from '../components/SearchBar'
import PromptListItem from '../components/PromptListItem'
import { PromptListItemMode, PromptListItemProps } from '../components/props/PromptItemProps'
import { ensureError } from '../../../common/exceptions'
import { useNavigate } from 'react-router'
import Dialog from '../components/Dialog'
import Snackbar from '../components/Snackbar'
import { SnackbarActionButton } from '../components/props/SnackbarProps'

const REFRESH_BUTTON_LABEL = 'Refresh'
const NEW_PROMPT_LABEL = 'New prompt'
const SEARCH_BAR_PLACEHOLDER = 'Search your prompts...'
const HEADER = 'Your Prompts'

const NEW_PROMPT_ICON = 'add'
const BROWSE_PROMPT_FILES_ICON = 'file_open'

/**
 * Presents list of all prompt stored and managed within the application's *user's files*.
 *
 * ### Modes
 *
 * Has 2 modes: *list* and *select*:
 * - *List*: User can interact with each prompt individually: remove it, edit it, select it to be used in LLM.
 * - *Select:* Allows user to interact with groups of selected prompts. Currently it's just removal.
 *
 * ### Browsing prompts
 *
 * Main functionality of this screen is browsing through the collection of prompts stored within *user's files*. Screen
 * is equipped with a search bar where user types text query that filters prompt list on submission. Currently this
 * mechanism is based on a simple **substring search**.
 *
 * When user submits an empty query (`''`) then all filters are cleared and all prompts are shown.
 *
 * Selected prompts (in *Selection Mode*) should stay visible even if they do not match the query. That would allow
 * user to gradually and conveniently search for prompts to select.
 *
 * ### Interactions
 *
 * - **Refresh:** Screen could be refreshed by clicking the `"Refresh"` button. This makes screen to reset abd reload
 * a list of prompts based on current *user's files* contents. It also makes a transition to the *List Mode*.
 *
 * - **New prompt:** Clicking the `"New prompt"` button should navigate user to the *Prompt Editor* screen.
 *
 * - **Browse files:** Clicking the folder button should navigates user to the file explorer with user's prompts
 * directory opened.
 *
 * - **Select prompt:** Selecting one of the prompts transits screen to the *Select Mode*. Where deleting and modifying
 * individual prompts is prohibited. Instead new multi-prompts interactions are available. Following selections upheld
 * this mode until at least one prompt is still selected. The *List Mode* is reenabled when no prompts are selected.
 *
 * - **Use prompt:** Clicking the prompt (in *List Mode*) from list navigates user to the *Prompt Fill* screen.
 *
 * - **Delete prompt:** Clicking the delete button of any prompt (in *List Mode*) shows a dialog that makes sure that
 * user wants to delete the prompt file. When confirmed it should delete the file.
 *
 * - **Edit prompt:** Clicking the edit button of any prompt (in *List Mode*) navigates user to the *Prompt Editor*
 * screen.
 *
 * - **Select all:** Clicking the `"Select all"` button (in *Select Mode*) would select all currently visible prompts.
 *
 * - **Cancel selection:** Clicking the `"Cancel"` button (in *Select Mode*) would exit the *Select Mode* to
 * *List Mode*.
 *
 * - **Delete selected:** Clicking the `"Delete selected"` button (in *Select Mode*) would show a dialog that makes sure
 * that user wants to delete all selected prompts. When confirmed it should delete those files.
 */
const PromptList: React.FunctionComponent<EmptyProps> = () => {
    const navigate = useNavigate()
    const [prompts, setPrompts] = useState<Map<string, PromptListItemProps>>(new Map())
    const [snackbarData, setSnackbarData] = useState<_SnackbarData | undefined>(undefined)
    const [editDialogData, setEditDialogData] = useState<_EditDialogData>({
        isVisible: false,
        targetPromptPath: null
    })
    const [deleteDialogData, setDeleteDialogData] = useState<_DeleteDialogData>({
        isVisible: false,
        targetPromptPath: null
    })
    const [searchQuery, setSearchQuery] = useState('')
    const visiblePrompts = useMemo(
        () => _searchStrategy(searchQuery, Array.from(prompts.values())),
        [prompts, searchQuery]
    )

    const _refresh = async (): Promise<void> => {
        setSearchQuery('')
        try {
            const result = await _reloadPrompts()
            setPrompts(result.prompts)
            setSnackbarData(result.snackbarData)
        } catch (e) {
            console.error(ensureError(e).message)
            setPrompts(new Map())
            setSnackbarData({ message: 'Prompt loading error!' })
        }
    }

    const _onDeleteConfirmed = (): void => {
        _deletePrompts(deleteDialogData.targetPromptPath, prompts)
            .then((result) => {
                _refresh()
                    .then(() => setSnackbarData(result.snackbarData))
                    .catch((e) => console.error(ensureError(e).message))
            })
            .catch((e) => {
                console.error(ensureError(e))
                setSnackbarData({ message: 'Deletion error!' })
            })
            .finally(() =>
                setDeleteDialogData({
                    isVisible: false,
                    targetPromptPath: null
                })
            )
    }

    useEffect(() => {
        _refresh().catch((e) => console.log(ensureError(e).message))
    }, [])

    return (
        <div className="prompt-list-body">
            {snackbarData && (
                <Snackbar
                    message={snackbarData.message}
                    actionButton={snackbarData.action}
                    onClosed={() => setSnackbarData(undefined)}
                />
            )}
            {editDialogData.isVisible && (
                <Dialog
                    mainButton={{
                        label: 'Confirm',
                        onClick: () =>
                            navigate(`editor?prompt=${editDialogData.targetPromptPath}`) as void
                    }}
                    secondaryButton={{
                        label: 'Cancel',
                        onClick: () => setEditDialogData((prev) => ({ ...prev, isVisible: false }))
                    }}
                    supportingText="Do you want to edit this prompt?"
                    iconName="edit"
                />
            )}
            {deleteDialogData.isVisible && (
                <Dialog
                    mainButton={{
                        label: 'Confirm',
                        onClick: _onDeleteConfirmed
                    }}
                    secondaryButton={{
                        label: 'Cancel',
                        onClick: () =>
                            setDeleteDialogData({ isVisible: false, targetPromptPath: null })
                    }}
                    supportingText={
                        deleteDialogData.targetPromptPath !== null
                            ? `Do you want to remove "${prompts.get(deleteDialogData.targetPromptPath)?.title}"?`
                            : 'Do you want to delete selected prompts?'
                    }
                    iconName="delete"
                />
            )}
            <div className="header">
                <Text
                    type={TextType.display}
                    size={TextSize.medium}
                    isEmphasized={true}
                    isSerif={true}
                >
                    {HEADER}
                </Text>
                <div className="header-buttons">
                    <IconButton
                        iconName={BROWSE_PROMPT_FILES_ICON}
                        shape={ButtonShape.square}
                        size={ButtonSize.small}
                        color={IconButtonColor.outlined}
                        onClick={_onBorwsePromptFilesClicked}
                    />
                    <Button
                        label={REFRESH_BUTTON_LABEL}
                        shape={ButtonShape.square}
                        onClick={() => {
                            _refresh().catch((e) => console.error(ensureError(e).message))
                        }}
                        color={ButtonColor.outlined}
                    />
                    <Button
                        label={NEW_PROMPT_LABEL}
                        icon_name={NEW_PROMPT_ICON}
                        shape={ButtonShape.square}
                        onClick={() => {
                            navigate('editor') as void
                        }}
                    />
                </div>
            </div>
            <SearchBar
                query={searchQuery}
                placeholder={SEARCH_BAR_PLACEHOLDER}
                onChanged={(e) => setSearchQuery(e.target.value)}
            />
            <div className="prompt-list-items">
                <div className="prompt-list-actions">
                    <Text>
                        Found <b>{visiblePrompts.length}</b> matching prompts
                    </Text>
                    {prompts
                        .values()
                        .some((prompt) => prompt.mode === PromptListItemMode.SELECTED) && (
                        <div className="prompt-list-action-buttons">
                            <Button
                                label="Select all"
                                color={ButtonColor.text}
                                shape={ButtonShape.square}
                                onClick={() =>
                                    setPrompts((prevPrompts) => _selectAllPrompts(prevPrompts))
                                }
                            />
                            <Button
                                label="Cancel"
                                color={ButtonColor.outlined}
                                shape={ButtonShape.square}
                                onClick={() =>
                                    setPrompts((prevPrompts) => _deselectAllPrompts(prevPrompts))
                                }
                            />
                            <Button
                                label="Delete selected"
                                icon_name="delete"
                                color={ButtonColor.filledError}
                                shape={ButtonShape.square}
                                onClick={() =>
                                    setDeleteDialogData({
                                        targetPromptPath: null,
                                        isVisible: true
                                    })
                                }
                            />
                        </div>
                    )}
                </div>
                {visiblePrompts.map((prompt) => (
                    <PromptListItem
                        mode={
                            prompts.has(prompt.promptFilePath)
                                ? (prompts.get(prompt.promptFilePath)?.mode as PromptListItemMode)
                                : PromptListItemMode.SELECTABLE
                        }
                        title={prompt.title}
                        promptFilePath={prompt.promptFilePath}
                        key={prompt.promptFilePath}
                        onClick={() => navigate('filler') as void}
                        onEditClick={() =>
                            setEditDialogData({
                                isVisible: true,
                                targetPromptPath: prompt.promptFilePath
                            })
                        }
                        onRemoveClick={() =>
                            setDeleteDialogData({
                                isVisible: true,
                                targetPromptPath: prompt.promptFilePath
                            })
                        }
                        onSelectionChanged={() =>
                            setPrompts((prevPrompts) =>
                                _onPromptSelected(prompt.promptFilePath, prevPrompts)
                            )
                        }
                    />
                ))}
            </div>
        </div>
    )
}

const _reloadPrompts = async (): Promise<{
    prompts: Map<string, PromptListItemProps>
    snackbarData: _SnackbarData | undefined
}> => {
    const promptListing = await window.prompts.listPrompts()

    if (!promptListing.success) {
        console.error(promptListing.error)
        return { prompts: new Map(), snackbarData: { message: "Can't load prompts!" } }
    }

    const loadedPrompts: PromptListItemProps[] = await Promise.all(
        promptListing.result.map(async (promptPath) => ({
            title: await window.prompts.promptTitle(promptPath),
            mode: PromptListItemMode.SELECTABLE,
            promptFilePath: promptPath
        }))
    )
    const newPrompts = new Map<string, PromptListItemProps>()
    loadedPrompts.forEach((prompt) => newPrompts.set(prompt.promptFilePath, prompt))

    return { prompts: newPrompts, snackbarData: undefined }
}

const _deletePrompts = async (
    deletedPromptPath: string | null,
    prompts: Map<string, PromptListItemProps>
): Promise<{ snackbarData: _SnackbarData; success: boolean }> => {
    if (deletedPromptPath !== null) {
        const promptTitle = prompts.get(deletedPromptPath)?.title
        try {
            const deletion = await window.prompts.deletePrompt(deletedPromptPath)
            if (!deletion.success) {
                console.error(deletion.error)
                return {
                    success: true,
                    snackbarData: { message: `Can't delete prompt ${promptTitle}!` }
                }
            }
        } catch (e) {
            console.error(ensureError(e))
            return {
                success: false,
                snackbarData: { message: `Can't delete prompt ${promptTitle}!` }
            }
        }
        return { success: true, snackbarData: { message: 'Deleted prompt!' } }
    } else {
        let errorOccurred = false
        const selectedPrompts = prompts
            .values()
            .filter((prompt) => prompt.mode === PromptListItemMode.SELECTED)
        const promptsDeletion = Promise.all(
            selectedPrompts.map(async (prompt) => {
                try {
                    const deletion = await window.prompts.deletePrompt(prompt.promptFilePath)
                    if (!deletion.success) {
                        errorOccurred = true
                        console.error(
                            `Delete "${prompt.promptFilePath}" error: "${deletion.error.message}"`
                        )
                    }
                } catch (thrownValue) {
                    console.error(ensureError(thrownValue).message)
                    errorOccurred = true
                }
            })
        )

        try {
            await promptsDeletion
        } catch (thrown) {
            console.error(ensureError(thrown).message)
            return { success: false, snackbarData: { message: "Can't delete prompts!" } }
        }
        if (errorOccurred)
            return { success: false, snackbarData: { message: "Some prompts weren't deleted!" } }

        return { success: true, snackbarData: { message: 'Deleted prompts!' } }
    }
}

const _searchStrategy = (query: string, prompts: PromptListItemProps[]): PromptListItemProps[] => {
    if (query === '') return prompts
    return prompts.filter(
        (prompt) => prompt.title.includes(query) || prompt.mode === PromptListItemMode.SELECTED
    )
}

const _deselectAllPrompts = (
    prompts: Map<string, PromptListItemProps>
): Map<string, PromptListItemProps> => {
    const newPrompts = new Map(prompts)
    newPrompts.values().forEach((prompts) => (prompts.mode = PromptListItemMode.SELECTABLE))
    return newPrompts
}

const _selectAllPrompts = (
    prompts: Map<string, PromptListItemProps>
): Map<string, PromptListItemProps> => {
    const newPrompts = new Map(prompts)
    newPrompts.values().forEach((prompt) => (prompt.mode = PromptListItemMode.SELECTED))
    return newPrompts
}

const _onPromptSelected = (
    selectedPromptFilePath: string,
    prompts: Map<string, PromptListItemProps>
): Map<string, PromptListItemProps> => {
    const promptsWithUpdatedSelections = new Map<string, PromptListItemProps>()

    // Entering selection mode
    if (prompts.values().every((prompt) => prompt.mode === PromptListItemMode.SELECTABLE)) {
        prompts.forEach((prompt) =>
            promptsWithUpdatedSelections.set(prompt.promptFilePath, {
                ...prompt,
                mode:
                    prompt.promptFilePath === selectedPromptFilePath
                        ? PromptListItemMode.SELECTED
                        : PromptListItemMode.DESELECTED
            })
        )
        return promptsWithUpdatedSelections
    }

    // Exiting selection mode
    const isTargetPromptSelected = prompts
        .values()
        .some(
            (prompt) =>
                prompt.mode === PromptListItemMode.SELECTED &&
                prompt.promptFilePath === selectedPromptFilePath
        )
    const areOtherIndiciesNotSelected = prompts
        .values()
        .every(
            (prompt) =>
                prompt.promptFilePath === selectedPromptFilePath ||
                prompt.mode === PromptListItemMode.DESELECTED
        )
    if (areOtherIndiciesNotSelected && isTargetPromptSelected) {
        prompts.forEach((prompt) =>
            promptsWithUpdatedSelections.set(prompt.promptFilePath, {
                ...prompt,
                mode: PromptListItemMode.SELECTABLE
            })
        )
        return promptsWithUpdatedSelections
    }

    // Remaining in selection mode
    prompts.forEach((prompt) =>
        promptsWithUpdatedSelections.set(prompt.promptFilePath, {
            ...prompt,
            mode:
                prompt.promptFilePath === selectedPromptFilePath
                    ? isTargetPromptSelected
                        ? PromptListItemMode.DESELECTED
                        : PromptListItemMode.SELECTED
                    : prompt.mode
        })
    )
    return promptsWithUpdatedSelections
}

function _onBorwsePromptFilesClicked(event: React.MouseEvent<HTMLButtonElement>): void {
    event.altKey.valueOf()
    console.log('browsing files with prompts')
}

interface _EditDialogData {
    isVisible: boolean
    targetPromptPath: string | null
}

interface _DeleteDialogData {
    isVisible: boolean
    targetPromptPath: string | null // null for selected prompts
}

interface _SnackbarData {
    message: string
    action?: SnackbarActionButton
}

export default PromptList
