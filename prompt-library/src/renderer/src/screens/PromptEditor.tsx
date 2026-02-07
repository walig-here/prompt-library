import React, { useEffect, useState } from 'react'
import Text from '../components/Text'
import { TextSize, TextType } from '../components/props/TextProps'
import Button from '../components/Button'
import { ButtonColor, ButtonShape } from '../components/props/ButtonProps'
import { useNavigate, useSearchParams } from 'react-router'
import FormItem from '../components/FormItem'
import PlaceholdersList from '../components/PlaceholdersList'
import { ensureError } from '../../../common/exceptions'
import Snackbar from '../components/Snackbar'
import { TextFieldStyle, TextFieldValidationResult } from '../components/props/TextFieldProps'
import Dialog from '../components/Dialog'
import TextField from '../components/TextField'
import '../assets/screens/PromptEditor.css'

/**
 * Allows to modify prompt's attributes: it's name and contents.
 *
 * ### Modes
 *
 * The screen has 2 modes:
 *
 * - **New prompt:** Used to create new prompts.
 * - **Existing prompt:** Used to modify data of existing prompts.
 *
 * The mode is set by the `prompt=<path>` location parameter placed in the URL. If it's present then the screen is in
 * the *Existing prompt* mode for prompt whose file's user-data-relative path is provided in the parameter. When such
 * file doesn't exist or when prompt parameter is not present, then screen is in the *New prompt* mode.
 *
 * ### Values in input fields
 *
 * In the *New prompt* mode all input fields should be empty. Default values in this situation are just empty values.
 *
 * In the case of *Existing prompt* mode, fields should be populated with current values of the edited prompt.
 * Also, those values become default values for their fields.
 *
 * ### Placeholder detection
 *
 * Screen scans prompt's content input field in order to find placeholders values placed there by the user.
 * The placeholder is an identifier put inside the `${}` structure, example: `${PLACEHOLDER}`. All detected
 * placeholders would be placed within the `"Detected placeholders"` section.
 *
 * ### User interactions
 *
 * - **Saving prompt:** In *New prompt* mode new prompt file is created when user clicks `"Save prompt"` button. In the
 * *Existing prompt* mode prompt file is overriden with the new values from the editor. In both cases the user is
 * navigated back to the *Prompt List* screen.
 *
 * - **Canceling:** The `"Cancel"` button can be used to exit the screen and go back to *Prompt List*. Exit happens
 * only after user confirms it within the dialog. Exiting screen this way doesn't apply any changes made in the editor.
 *
 * - **Edit placeholder:** User can clisk the `"Edit"` button for each detected placeholder from prompt's content and
 * change placeholder's name in dedicated modal. This would change placeholder names across whole prompt's content.
 *
 * ### Validation
 *
 * User can't save the prompt until all validation check passes. The validation checks are:
 *
 * - **Name:** Prompt name must be a non-epmty string that is a valid file name. Must be unique.
 *
 * If validation checks fail then each save results in snackbar message with error.
 */
const PromptEditor: React.FunctionComponent<EmptyProps> = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [promptData, setPromptData] = useState<_PromptData>({ content: '', name: '' })
    const [defaultPromptData, setDefaultPromptData] = useState<_PromptData>({
        content: '',
        name: ''
    })
    const [snackbarData, setSnackbarData] = useState<_SnackbarData>({
        isVisible: false,
        message: ''
    })
    const [cancelDialogData, setCancelDialogData] = useState<_CancelDialogData>({
        isVisible: false
    })
    const [editPlaceholderDialogData, setEditPlaceholderDialogData] =
        useState<_EditPlaceholderDialogData>({
            isVisible: false,
            placeholderId: '',
            oldPlaceholderId: ''
        })

    useEffect(() => {
        const promptPath = searchParams.get('prompt')
        if (!promptPath) return

        _getPromptData(promptPath)
            .then((dataLoad) => {
                if (dataLoad.success) {
                    setPromptData(dataLoad.result)
                    setDefaultPromptData(dataLoad.result)
                } else setSnackbarData({ message: dataLoad.error.message, isVisible: true })
            })
            .catch((error) =>
                setSnackbarData({ message: ensureError(error).message, isVisible: true })
            )
    }, [searchParams])

    const _savePrompt = async (): Promise<void> => {
        const nameValidationResult = _validateName(promptData.name)
        if (!nameValidationResult.success) {
            setSnackbarData({ isVisible: true, message: nameValidationResult.reason })
            return
        }

        try {
            const result = await window.prompts.savePrompt(
                promptData.name,
                promptData.content,
                searchParams.get('prompt')
            )
            if (!result.success) {
                console.error(`Can't save prompt: ${result.error.message}`)
                setSnackbarData({ isVisible: true, message: result.error.message })
            } else {
                await navigate('/')
            }
        } catch (thrown) {
            const error = ensureError(thrown)
            console.log(`Can't save prompt: ${error}`)
            setSnackbarData({ isVisible: true, message: error.message })
        }
    }

    return (
        <div className="prompt-editor-body">
            {editPlaceholderDialogData.isVisible && (
                <Dialog
                    supportingText={`Enter new identifier for placehoder $\{${editPlaceholderDialogData.oldPlaceholderId}}.`}
                    mainButton={{
                        label: 'Confirm',
                        onClick: () => {
                            setPromptData((prev) => ({
                                ...prev,
                                content: _renamePlaceholder(
                                    prev.content,
                                    editPlaceholderDialogData.oldPlaceholderId,
                                    editPlaceholderDialogData.placeholderId
                                )
                            }))
                            setEditPlaceholderDialogData({
                                isVisible: false,
                                oldPlaceholderId: '',
                                placeholderId: ''
                            })
                        }
                    }}
                    secondaryButton={{
                        label: 'Cancel',
                        onClick: () => {
                            setEditPlaceholderDialogData({
                                isVisible: false,
                                placeholderId: '',
                                oldPlaceholderId: ''
                            })
                        }
                    }}
                >
                    <TextField
                        label="Placeholder identifier"
                        style={TextFieldStyle.filled}
                        value={editPlaceholderDialogData.placeholderId}
                        onChange={(e) =>
                            setEditPlaceholderDialogData((prev) => ({
                                ...prev,
                                placeholderId: e.target.value
                            }))
                        }
                    />
                </Dialog>
            )}
            {cancelDialogData.isVisible && (
                <Dialog
                    supportingText="Would you like to exit the editor? All changes would be lost!"
                    mainButton={{ label: 'Confirm', onClick: () => navigate('/') as void }}
                    secondaryButton={{
                        label: 'Cancel',
                        onClick: () => {
                            setCancelDialogData({ isVisible: false })
                        }
                    }}
                ></Dialog>
            )}
            {snackbarData.isVisible && (
                <Snackbar
                    message={snackbarData.message}
                    onClosed={() => setSnackbarData({ isVisible: false, message: '' })}
                />
            )}
            <div className="prompt-editor-header">
                <Text
                    type={TextType.display}
                    size={TextSize.medium}
                    isEmphasized={true}
                    isSerif={true}
                >
                    Prompt Editor
                </Text>
                <div className="prompt-editor-header-buttons-container">
                    <Button
                        label="Cancel"
                        color={ButtonColor.outlined}
                        onClick={() => setCancelDialogData({ isVisible: true })}
                        shape={ButtonShape.square}
                    />
                    <Button
                        label="Save prompt"
                        shape={ButtonShape.square}
                        icon_name="check"
                        onClick={() => {
                            _savePrompt().catch((thrown) => {
                                const error = ensureError(thrown)
                                console.error(`Can't save prompt: ${error.message}`)
                                setSnackbarData({ isVisible: true, message: error.message })
                            })
                        }}
                    />
                </div>
            </div>
            <section className="prompt-editor-form">
                <FormItem
                    value={promptData.name}
                    label="Name"
                    onChange={(e) => setPromptData((prev) => ({ ...prev, name: e.target.value }))}
                    validationStrategy={_validateName}
                    defaultValue={defaultPromptData.name}
                />
                <div className="prompt-editor-content-container">
                    <FormItem
                        value={promptData.content}
                        label="Content"
                        description="Enter content of your ptompt. Use ${PLACEHOLDER} to create fillable fields that will be replaced with actual values when you use this prompt."
                        lines={10}
                        onChange={(e) =>
                            setPromptData((prev) => ({ ...prev, content: e.target.value }))
                        }
                        defaultValue={defaultPromptData.content}
                    />
                    <PlaceholdersList
                        placeholders={
                            new Set(
                                _getPlaceholders(promptData.content)
                                    .values()
                                    .map((placeholderId) => ({ name: placeholderId }))
                            )
                        }
                        placeholderInteraction={{
                            iconName: 'edit',
                            callback: (placeholder) =>
                                setEditPlaceholderDialogData({
                                    isVisible: true,
                                    placeholderId: placeholder.name,
                                    oldPlaceholderId: placeholder.name
                                })
                        }}
                    />
                </div>
            </section>
        </div>
    )
}

interface _SnackbarData {
    isVisible: boolean
    message: string
}

interface _EditPlaceholderDialogData {
    isVisible: boolean
    placeholderId: string
    oldPlaceholderId: string
}

interface _CancelDialogData {
    isVisible: boolean
}

interface _PromptData {
    name: string
    content: string
}

function _validateName(name: string): TextFieldValidationResult {
    const unwantedChars = ['.', '/', '\\', '~']
    const checks: { condition: boolean; error: string }[] = [
        {
            condition: unwantedChars.every((invalidChar) => !name.includes(invalidChar)),
            error: "Prompt name can't include forbidden characters"
        },
        { condition: name !== '', error: "Prompt name can't empty" }
    ]

    for (const check of checks) {
        if (!check.condition) {
            return { reason: check.error, success: false }
        }
    }
    return { success: true }
}

function _getPlaceholders(promptContent: string): Set<string> {
    const pattern = /\$\{([a-zA-Z]+)\}/g
    const matches = Array.from(promptContent.matchAll(pattern))
    return new Set(matches.map((match) => match[1]))
}

function _renamePlaceholder(
    promptContent: string,
    oldPlaceholderId: string,
    newPlacholderId: string
): string {
    return promptContent.replaceAll(oldPlaceholderId, newPlacholderId)
}

async function _getPromptData(
    path: string
): Promise<{ result: _PromptData; success: true } | { error: Error; success: false }> {
    try {
        const [promptTitle, promptContentRead] = await Promise.all([
            window.prompts.promptTitle(path),
            window.prompts.loadFromFile(path)
        ])

        if (!promptContentRead.success) {
            console.error(`Can't read prompt data. Reason: ${promptContentRead.error.message}`)
            return { success: false, error: promptContentRead.error }
        }
        return {
            success: true,
            result: { content: promptContentRead.result, name: promptTitle }
        }
    } catch (thrown) {
        const error = ensureError(thrown)
        console.error(`Can't load prompt data. Reason: ${error.message}`)
        return { success: false, error: error }
    }
}

export default PromptEditor
