import React from 'react'
import Text from '../components/Text'

/**
 * Allows to prepare prompt with placeholders for utilizing it in the LLM. It simply allows to replace placeholders
 * with final values.
 *
 * It has 2 modes: *no preview* and *preview*. In the *preview* mode user can see the filled prompt without
 * placeholders. In the *no preview* the user has not such option.
 */
const PromptFill: React.FunctionComponent<EmptyProps> = () => {
    return <Text>Prompt Filler</Text>
}

export default PromptFill
