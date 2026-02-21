import { ButtonColor, ButtonShape } from '../components/props/ButtonProps'
import Button from '../components/Button'
import Text from '../components/Text'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import IconButton from '../components/IconButton'
import FormItem from '../components/FormItem'
import { ensureError } from '../../../common/exceptions'
import { TextFieldValidationResult } from '../components/props/TextFieldProps'
import '../assets/screens/PromptFill.css'
import { ContentWidthContext, ContentWidthContextData } from '../contexts'
import { TextColor, TextSize, TextType } from '../components/props/TextProps'

/**
 * Allows to prepare prompt with placeholders for utilizing it in the LLM. It simply allows to replace placeholders
 * with final values.
 *
 * ### Loading prompt data
 *
 * URL for this screen must contain `prompt=path` parameter that contains user-data-relative path of the file with
 * prompt that's beeing filled.
 *
 * ### Modes
 *
 * This screen has 2 modes:
 *
 * 1. **No preview:** Preview with filled prompt is not visible.
 * 2. **Preview:** Preview with filled prompt is visible. This is default when prompt contains no placeholders.
 *
 * ### User interactions
 *
 * - **Cancelling:** User click the `"Cancel"` button to stop filling the prompt and go back to the *Prompt List*
 * screen.
 *
 * - **Confirming prompt:** User click the `"Confirm"` button to confirm filled values. If all the filled fields
 * validated propely then the filled prompt is saved to the user's clipboard and app navigates to the *Prompt List*
 * screen. Otherwise the error message appears and user statys in the current screen.
 *
 * - **Close/Show Preview:** User click the `"Close"` button when the preview is visible in order to close it. Similarly
 * user clicks `"Show"` button when preview is not visible in order to show it.
 *
 * ### Validation
 *
 * Prompt can't be filled until all the validation checks are passed:
 *
 * - Each placeholder must be filled (not empty).
 */
const PromptFill: React.FunctionComponent<EmptyProps> = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [promptData, setPromptData] = useState<_PromptData>({
        placeholders: [],
        promptContent: ''
    })
    const [isPreviewVisible, setIsPreviewVisible] = useState(false)
    const contentWidthContext = useContext<ContentWidthContextData>(ContentWidthContext)

    useEffect((): void => {
        contentWidthContext.setWidth(isPreviewVisible ? 'main-content-wide' : 'main-content')
    }, [contentWidthContext, isPreviewVisible])

    useEffect(() => {
        const promptPath = searchParams.get('prompt')
        if (!promptPath) {
            navigate('/') as void
            return
        }

        _getPromptData(promptPath)
            .then((dataLoad) => {
                if (dataLoad.success) {
                    setPromptData(dataLoad.result)
                    setIsPreviewVisible(dataLoad.result.placeholders.length === 0)
                } else navigate('/') as void
            })
            .catch(() => navigate('/'))
    }, [searchParams, navigate])

    const _onConfirmClicked = (): void => {
        promptData.placeholders.every(
            (placeholder) => _placeholderValueValidator(placeholder.value).success
        ) &&
            navigator.clipboard
                .writeText(
                    _replacePlaceholders(
                        promptData.promptContent,
                        new Map(
                            promptData.placeholders.map((placeholder) => [
                                placeholder.name,
                                placeholder.value !== ''
                                    ? placeholder.value
                                    : `\${${placeholder.name}}`
                            ])
                        )
                    )
                )
                .then(() => navigate('/') as void)
                .catch((e) => console.log(e))
    }

    return (
        <div className="prompt-filler-body">
            <div
                className={`prompt-filler-form-container${isPreviewVisible ? ' prompt-filler-form-container-with-preview' : ''}`}
            >
                <div className="prompt-filler-header-container">
                    <Text
                        type={TextType.display}
                        size={TextSize.medium}
                        isEmphasized={true}
                        isSerif={true}
                    >
                        Prompt Filler
                    </Text>
                    <div className="prompt-filler-header-buttons-container">
                        <Button
                            label="Cancel"
                            color={ButtonColor.outlined}
                            shape={ButtonShape.square}
                            onClick={() => navigate('/') as void}
                        />
                        {isPreviewVisible ? (
                            <IconButton
                                iconName="preview_off"
                                onClick={() => setIsPreviewVisible(false)}
                            />
                        ) : (
                            <IconButton
                                iconName="preview"
                                onClick={() => setIsPreviewVisible(true)}
                            />
                        )}
                        <Button
                            label="Confirm"
                            icon_name="check"
                            color={ButtonColor.filled}
                            shape={ButtonShape.square}
                            onClick={() => _onConfirmClicked()}
                        />
                    </div>
                </div>
                <div className="prompt-filler-inputs-container">
                    {promptData.placeholders.map((placeholder) => (
                        <FormItem
                            label={placeholder.name}
                            key={placeholder.name}
                            value={placeholder.value}
                            lines={2}
                            validationStrategy={_placeholderValueValidator}
                            onChange={(e) =>
                                setPromptData((prev) => ({
                                    ...prev,
                                    placeholders: prev.placeholders.map((prevPlaceholder) => ({
                                        ...prevPlaceholder,
                                        value:
                                            placeholder.name === prevPlaceholder.name
                                                ? e.target.value
                                                : prevPlaceholder.value
                                    }))
                                }))
                            }
                        />
                    ))}
                </div>
            </div>
            {isPreviewVisible && (
                <div className="prompt-filler-preview-container">
                    <Text
                        type={TextType.display}
                        size={TextSize.medium}
                        isEmphasized={true}
                        isSerif={true}
                        color={TextColor.secondary}
                    >
                        Preview
                    </Text>
                    <div className="prompt-filler-preview-text-container">
                        <Text color={TextColor.variant}>
                            {_replacePlaceholders(
                                promptData.promptContent,
                                new Map(
                                    promptData.placeholders.map((placeholder) => [
                                        placeholder.name,
                                        placeholder.value !== ''
                                            ? placeholder.value
                                            : `\${${placeholder.name}}`
                                    ])
                                )
                            )}
                        </Text>
                    </div>
                </div>
            )}
        </div>
    )
}

interface _PlaceholderData {
    name: string
    value: string
}

interface _PromptData {
    promptContent: string
    placeholders: _PlaceholderData[]
}

function _placeholderValueValidator(placeholderValue: string): TextFieldValidationResult {
    return placeholderValue === ''
        ? { reason: 'Placeholder must be filled.', success: false }
        : { success: true }
}

function _replacePlaceholders(template: string, placeholders: Map<string, string>): string {
    let filled_template = template
    for (const [placeholder, value] of placeholders) {
        filled_template = filled_template.replaceAll(`\${${placeholder}}`, value)
    }
    return filled_template
}

function _getPlaceholders(promptContent: string): Set<string> {
    const pattern = /\$\{(([^{}])+)\}/g
    const matches = Array.from(promptContent.matchAll(pattern))
    return new Set(matches.map((match) => match[1]))
}

async function _getPromptData(
    path: string
): Promise<{ result: _PromptData; success: true } | { error: Error; success: false }> {
    try {
        const promptContentRead = await window.prompts.loadFromFile(path)

        if (!promptContentRead.success) {
            console.error(`Can't read prompt data. Reason: ${promptContentRead.error.message}`)
            return { success: false, error: promptContentRead.error }
        }

        const placeholders = Array.from(_getPlaceholders(promptContentRead.result)).map(
            (placeholer) => ({ name: placeholer, value: '' })
        )

        return {
            success: true,
            result: { promptContent: promptContentRead.result, placeholders: placeholders }
        }
    } catch (thrown) {
        const error = ensureError(thrown)
        console.error(`Can't load prompt data. Reason: ${error.message}`)
        return { success: false, error: error }
    }
}

export default PromptFill
