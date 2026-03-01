import { useState } from 'react'
import IconButton from './IconButton'
import { ButtonShape, IconButtonColor } from './props/ButtonProps'
import { PromptListItemMode, PromptListItemProps } from './props/PromptItemProps'
import Text from './Text'
import '../assets/components/PromptListItem.css'
import { TextColor, TextSize, TextType } from './props/TextProps'
import Checkbox from './Checkbox'
import { CheckboxState } from './props/CheckboxProps'

/**
 * Item of the prompt list that contains the most important info about a prompt/prompt template. It also allows to
 * perform some basic interactions with a prompt.
 *
 * ### Mode
 *
 * The component can be in one of 3 modes that are passed via the `mode` prop:
 *
 * 1. Selectable -- it's possible to select item or use actions associated with individual prompt (action buttons
 * and checkbox visible when hovered).
 * 2. Selected -- item is already selected. It can be deselected but it's not possible to use actions associated with
 * individual prompt since selection suggests that some kind of aggregated acions on many prompts are going to be
 * performed (action buttons invisible, checkbox always visible).
 * 3. Deselected -- item is not selected. It can be selected but it's not possible to use actions associated with
 * individual prompt since this mode suggests that some kind of aggregated actions on many prompts are going to be
 * performed (action buttons invisible, checkbox always visible).
 *
 * ### Interactions
 *
 * Prompt list item can be clicked to perform some kind of main action with the prompt/ptompt template. In the easiest
 * case this would be using/filling the prompt/prompt template. Clicking triggers the `onClick()` callback when in the
 * "Selectable" mode. Otherwise nothing happens.
 *
 * Item also has 2 additional buttons:
 *
 * 1. Edit button -- for triggerring `onEditClick()` action associated with editing the prompt.
 * 2. Remove button -- for treiggering `onRemoveClick()` action associated with removing the prompt.
 *
 * In the end, the component also contains a checkbox that defines whether the item is selected. Clicking it triggers
 * the `onSelectionChanged()` callback.
 */
const PromptListItem: React.FunctionComponent<PromptListItemProps> = ({
    mode,
    promptFilePath,
    title,
    onClick = undefined,
    onEditClick = undefined,
    onRemoveClick = undefined,
    onSelectionChanged = undefined
}: PromptListItemProps) => {
    const [actionsVisible, setActionsVisible] = useState(false)

    return (
        <div
            role="listitem"
            className={`promt-list-item-container ${mode.valueOf()}`}
            onMouseEnter={() => setActionsVisible(true)}
            onMouseLeave={() => setActionsVisible(false)}
            onClick={() => mode === PromptListItemMode.SELECTABLE && onClick?.(promptFilePath)}
        >
            <div className="prompt-list-item-leading-elements">
                {(actionsVisible || mode !== PromptListItemMode.SELECTABLE) && (
                    <Checkbox
                        state={
                            mode === PromptListItemMode.SELECTED
                                ? CheckboxState.checked
                                : CheckboxState.unchecked
                        }
                        onChange={(event) => {
                            event.stopPropagation()
                            onSelectionChanged?.(event)
                        }}
                        onClick={(event) => event.stopPropagation()}
                        disabled={!onSelectionChanged}
                    />
                )}
                <div>
                    <Text size={TextSize.large} type={TextType.body}>
                        {title}
                    </Text>
                    <Text size={TextSize.medium} type={TextType.body} color={TextColor.variant}>
                        {promptFilePath}
                    </Text>
                </div>
            </div>
            {actionsVisible && mode === PromptListItemMode.SELECTABLE && (
                <div className="prompt-list-item-trailing-elements">
                    <IconButton
                        iconName="edit"
                        shape={ButtonShape.square}
                        color={IconButtonColor.outlined}
                        onClick={(event) => {
                            event.stopPropagation()
                            onEditClick?.(promptFilePath)
                        }}
                        disabled={!onEditClick}
                    />
                    <IconButton
                        onClick={(event) => {
                            event.stopPropagation()
                            onRemoveClick?.(promptFilePath)
                        }}
                        iconName="delete"
                        shape={ButtonShape.square}
                        color={IconButtonColor.outlinedError}
                        disabled={!onRemoveClick}
                    />
                </div>
            )}
        </div>
    )
}

export default PromptListItem
