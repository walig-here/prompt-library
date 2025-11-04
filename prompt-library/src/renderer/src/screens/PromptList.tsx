import React, { useEffect, useState } from 'react'
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
import Checkbox from '../components/Checkbox'
import { CheckboxState } from '../components/props/CheckboxProps'

const REFRESH_BUTTON_LABEL = 'Refresh'
const NEW_PROMPT_LABEL = 'New prompt'
const SEARCH_BAR_PLACEHOLDER = 'Search your prompts...'
const HEADER = 'Your Prompts'

const NEW_PROMPT_ICON = 'add'
const BROWSE_PROMPT_FILES_ICON = 'file_open'

/**
 * Presents list of all prompt stored and managed within the application.
 *
 * Has 2 modes: *list* and *select*. The *list* user can interact with each prompt individually: remove it, edit it,
 * select it to be used in LLM. The *select* mode allows user to interact with groups of selected prompts. Currently
 * it's just removal.
 */
const PromptList: React.FunctionComponent<EmptyProps> = () => {
    const [prompts, setPrompts] = useState<PromptListItemProps[]>([])
    const [filteredPrompts, setFilteredPrompts] = useState<PromptListItemProps[]>(prompts)

    const _reloadPrompts = (): void => {
        setPrompts([
            {
                mode: PromptListItemMode.SELECTABLE,
                promptFilePath: '/file1.txt',
                title: 'Prompt 1'
            },
            {
                mode: PromptListItemMode.SELECTABLE,
                promptFilePath: '/file2.txt',
                title: 'Prompt 2'
            }
        ])
    }

    useEffect(() => {
        _reloadPrompts()
    }, [])

    useEffect(() => {
        setFilteredPrompts(prompts)
    }, [prompts])

    const _onRefreshButtonClicked: React.MouseEventHandler<HTMLButtonElement> = () => {
        _reloadPrompts()
    }

    const _deselectAllPrompts = (): void => {
        setFilteredPrompts((prevPrompts) =>
            prevPrompts.map((prompt) => ({ ...prompt, mode: PromptListItemMode.SELECTABLE }))
        )
    }

    return (
        <div>
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
                        onClick={_onRefreshButtonClicked}
                        color={ButtonColor.outlined}
                    />
                    <Button
                        label={NEW_PROMPT_LABEL}
                        icon_name={NEW_PROMPT_ICON}
                        shape={ButtonShape.square}
                        onClick={_onNewPromptButtonClicked}
                    />
                </div>
            </div>
            <SearchBar
                collection={prompts}
                onSearched={(result) => setFilteredPrompts(result)}
                searchStrategy={(query, prompts) =>
                    query !== ''
                        ? prompts.filter((prompt) => prompt.title.includes(query))
                        : prompts
                }
                placeholder={SEARCH_BAR_PLACEHOLDER}
            />
            <div>
                <div>
                    <Text>
                        Found <b>{filteredPrompts.length}</b> matching prompts
                    </Text>
                    {filteredPrompts.some(
                        (prompt) => prompt.mode === PromptListItemMode.SELECTED
                    ) && (
                        <div>
                            <Button
                                label="Cancel"
                                color={ButtonColor.outlined}
                                shape={ButtonShape.square}
                                onClick={_deselectAllPrompts}
                            />
                            <Button
                                label="Delete selected"
                                icon_name="delete"
                                color={ButtonColor.filledError}
                                shape={ButtonShape.square}
                            />
                        </div>
                    )}
                </div>
                {filteredPrompts.map((prompt, index) => (
                    <PromptListItem
                        mode={prompt.mode}
                        title={prompt.title}
                        promptFilePath={prompt.promptFilePath}
                        key={index}
                        onClick={() => console.log(`click ${index}`)}
                        onEditClick={() => console.log(`edit ${index}`)}
                        onRemoveClick={() => console.log(`remove ${index}`)}
                        onSelectionChanged={() =>
                            setFilteredPrompts((prevPrompts) =>
                                _onPromptSelected(index, prevPrompts)
                            )
                        }
                    />
                ))}
                <Checkbox state={CheckboxState.unchecked} />
            </div>
        </div>
    )
}

const _onPromptSelected = (
    selectedPromptIndex: number,
    filteredPrompts: PromptListItemProps[]
): PromptListItemProps[] => {
    // Entering selection mode
    if (filteredPrompts.every((prompt) => prompt.mode === PromptListItemMode.SELECTABLE)) {
        return filteredPrompts.map((prompt, index) => ({
            ...prompt,
            mode:
                index === selectedPromptIndex
                    ? PromptListItemMode.SELECTED
                    : PromptListItemMode.DESELECTED
        }))
    }

    const changedIndexSelected =
        filteredPrompts[selectedPromptIndex].mode === PromptListItemMode.SELECTED
    const otherIndiciesNotSelected = filteredPrompts.every(
        (prompt, index) =>
            index === selectedPromptIndex || prompt.mode === PromptListItemMode.DESELECTED
    )

    // Exiting selection mode
    if (otherIndiciesNotSelected && changedIndexSelected) {
        return filteredPrompts.map((prompt) => ({
            ...prompt,
            mode: PromptListItemMode.SELECTABLE
        }))
    }

    // Remaining in selection mode
    return filteredPrompts.map((prompt, index) => ({
        ...prompt,
        mode:
            index === selectedPromptIndex
                ? changedIndexSelected
                    ? PromptListItemMode.DESELECTED
                    : PromptListItemMode.SELECTED
                : prompt.mode
    }))
}

function _onNewPromptButtonClicked(event: React.MouseEvent<HTMLButtonElement>): void {
    event.altKey.valueOf()
    console.log('new prompt clicked!')
}

function _onBorwsePromptFilesClicked(event: React.MouseEvent<HTMLButtonElement>): void {
    event.altKey.valueOf()
    console.log('browsing files with prompts')
}

export default PromptList
