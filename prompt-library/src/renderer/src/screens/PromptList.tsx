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
    const [prompts, setPrompts] = useState<PromptListItem[]>([])
    const [filteredPrompts, setFilteredPrompts] = useState<PromptListItem[]>(prompts)

    useEffect(() => {
        setFilteredPrompts(prompts)
    }, [prompts])

    const _onRefreshButtonClicked: React.MouseEventHandler<HTMLButtonElement> = () => {
        setPrompts([])
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
            <Text>
                Found <b>{filteredPrompts.length}</b> matching prompts
            </Text>
            {filteredPrompts.map((prompt, index) => (
                <div key={index}>{prompt.title}</div>
            ))}
        </div>
    )
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
