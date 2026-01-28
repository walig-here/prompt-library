export interface PlaceholderListProps {
    placeholders: Set<PlaceholderData>
    placeholderInteraction?: PlaceholderInteraction
}

export interface PlaceholderInteraction {
    iconName: string
    callback: (placeholder: PlaceholderData) => void
}

export interface PlaceholderData {
    name: string
}
