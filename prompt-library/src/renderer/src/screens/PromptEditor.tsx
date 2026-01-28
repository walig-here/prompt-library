import React from 'react'
import Text from '../components/Text'
import { TextSize, TextType } from '../components/props/TextProps'
import Button from '../components/Button'
import { ButtonColor, ButtonShape } from '../components/props/ButtonProps'
import { useNavigate } from 'react-router'
import FormItem from '../components/FormItem'
import PlaceholdersList from '../components/PlaceholdersList'

/**
 * Allows to modify prompt's attributes: it's name and contents.
 *
 * Has 2 modes: *new prompt* and *existing prompt*. In the *new prompt* mode it allows to fill attributes of new prompt
 * that could be stored in the system. In the *existing prompt* mode it allows to change attributes of the prompt that
 * already exists in the system.
 */
const PromptEditor: React.FunctionComponent<EmptyProps> = () => {
    const navigate = useNavigate()

    return (
        <div>
            <div>
                <Text
                    type={TextType.display}
                    size={TextSize.medium}
                    isEmphasized={true}
                    isSerif={true}
                >
                    Prompt Editor
                </Text>
                <div>
                    <Button
                        label="Cancel"
                        color={ButtonColor.outlined}
                        onClick={() => navigate('/') as void}
                        shape={ButtonShape.square}
                    />
                    <Button label="Save prompt" shape={ButtonShape.square} icon_name="check" />
                </div>
            </div>
            <div>
                <FormItem value="" label="Name" inputSupportingText="/path" />
                <div>
                    <FormItem
                        value=""
                        label="Content"
                        description="Enter content of your ptompt. Use ${PLACEHOLDER} to create fillable fields that will be replaced with actual values when you use this prompt."
                        lines={10}
                    />
                    <PlaceholdersList
                        placeholders={
                            new Set([{ name: 'dupa' }, { name: 'sraka' }, { name: 'hihi' }])
                        }
                        placeholderInteraction={{
                            iconName: 'edit',
                            callback: (placeholder) => console.log(placeholder)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default PromptEditor
