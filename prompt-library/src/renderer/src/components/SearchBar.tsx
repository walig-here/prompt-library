import React from 'react'
import { SearchBarProps } from './props/SearchBarProps'
import IconButton from './IconButton'
import { IconButtonColor } from './props/ButtonProps'
import '../assets/components/SearchBar.css'

/**
 * A search bar that follows Material Design 3 principles. It allows user to search through injected collection.
 *
 * Specs: https://m3.material.io/components/search/overview
 *
 * ### Query
 *
 * Query is controlled by a parent. The component calls the `onChanged()` callback each time the query is changed.
 *
 * ### Configuration
 *
 * The search bar can be in one of the following visual configurations:
 * 1. With avatar -- when only `avatar` prop is passed.
 * 2. With one trailing icon button -- when only `firstTrailingIcon` is passed.
 * 3. With two trailing icon buttons -- when both `firstTrailingIcon` and `secondTrailingIcon` is passed.
 * 4. With avatar and trailing icon button -- when both `avatar` and either `firstTrailingIcon` or `secondTrailingIcon`
 * is passed.
 *
 * All other configurations would fallback to one with only leading icon.
 *
 * ### Icons' button binds
 *
 * All icons on search bar can have a click callback function passed for them. However, you can decicde to not pass a
 * callback.
 */
const SearchBar: React.FunctionComponent<SearchBarProps> = ({
    onChanged,
    query,
    firstTrailingIcon,
    avatar,
    secondTrailingIcon,
    onLeadingIconClicked = undefined,
    placeholder = ''
}) => {
    const allElementsPassed = firstTrailingIcon && secondTrailingIcon && avatar

    return (
        <div className="md-search-bar-container" role="searchbox">
            <IconButton
                iconName="search"
                color={IconButtonColor.standard}
                onClick={onLeadingIconClicked ? onLeadingIconClicked : () => {}}
            />
            <input
                role="search"
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={onChanged}
                className="md-search-bar-input"
            />
            {!allElementsPassed && firstTrailingIcon && (
                <IconButton
                    iconName={firstTrailingIcon.iconName}
                    color={IconButtonColor.standard}
                    onClick={
                        firstTrailingIcon.onIconClicked ? firstTrailingIcon.onIconClicked : () => {}
                    }
                />
            )}
            {!allElementsPassed && secondTrailingIcon && (firstTrailingIcon || avatar) && (
                <IconButton
                    iconName={secondTrailingIcon.iconName}
                    color={IconButtonColor.standard}
                    onClick={
                        secondTrailingIcon.onIconClicked
                            ? secondTrailingIcon.onIconClicked
                            : () => {}
                    }
                />
            )}
            {!allElementsPassed && avatar && (
                <img
                    src={avatar.uri}
                    onClick={avatar.onAvatarClicked ? avatar.onAvatarClicked : () => {}}
                    className="md-search-bar-avatar"
                />
            )}
        </div>
    )
}

export default SearchBar
