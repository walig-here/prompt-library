import React from 'react'
import Text from '../components/Text'

/**
 * Allows to modify prompt's attributes: it's name and contents.
 *
 * Has 2 modes: *new prompt* and *existing prompt*. In the *new prompt* mode it allows to fill attributes of new prompt
 * that could be stored in the system. In the *existing prompt* mode it allows to change attributes of the prompt that
 * already exists in the system.
 */
const PromptEditor: React.FunctionComponent<EmptyProps> = () => {
    return <Text>Prompt Editor</Text>
}

export default PromptEditor
