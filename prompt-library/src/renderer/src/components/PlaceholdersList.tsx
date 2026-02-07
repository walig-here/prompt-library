import React from 'react'
import { PlaceholderListProps } from './props/PlaceholdersListProps'
import Text from './Text'
import Chip from './Chip'
import { ChipType } from './props/ChipProps'
import { TextSize } from './props/TextProps'
import '../assets/components/PlaceholdersList.css'

/**
 * A list of placeholders that has been detected inside prompt's body.
 *
 * ### User interactions
 *
 * Each placeholder on the list can be interacted with. You can define a generic interaction for all the placeholders
 * via the `placeholderInteraction.callback()` callback.
 */
const PlaceholdersList: React.FunctionComponent<PlaceholderListProps> = ({
    placeholders,
    placeholderInteraction = undefined
}: PlaceholderListProps) => {
    return (
        <div className="placeholder-list-container" role="list">
            <Text size={TextSize.medium} isEmphasized={true}>
                Detected placeholders
            </Text>
            <div className="placeholder-list-items">
                {Array.from(placeholders).map((placeholder) => (
                    <div key={placeholder.name} className="placeholder-list-item" role="listitem">
                        <Chip
                            label={placeholder.name}
                            type={ChipType.INPUT}
                            trailingIcon={
                                placeholderInteraction
                                    ? {
                                          iconName: placeholderInteraction.iconName,
                                          onClick: () =>
                                              placeholderInteraction.callback(placeholder)
                                      }
                                    : { iconName: 'add' }
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlaceholdersList
