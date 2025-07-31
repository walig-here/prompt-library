import React, { JSX, useEffect, useState } from 'react'
import { SearchBarProps } from './props/SearchBarProps'
import IconButton from './IconButton'
import { IconButtonColor } from './props/ButtonProps'
import '../assets/components/SearchBar.css'

/**
 * A search bar that follows Material Design 3 principles. It allows user to search through injected collection.
 *
 * Specs: https://m3.material.io/components/search/overview
 *
 * Bar would reset when unrelying, searched collection is modified.
 *
 * ### Search
 *
 * It uses the `searchStrategy()` in order to search throught collection `collection`. When the search is done then the
 * `onSearched()` is called with search result as an argument. This way you'll get access to the result outside the
 * component (eg. by using the set-state hook in there).
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
 * callback. In such case clicking the icon would result in triggerring the search functionality.
 */
const SearchBar = <T extends object>({
    collection,
    onSearched,
    searchStrategy,
    firstTrailingIcon,
    avatar,
    secondTrailingIcon,
    onLeadingIconClicked = undefined,
    placeholder = ''
}: SearchBarProps<T>): JSX.Element => {
    const [query, setQuery] = useState<string>('')
    const allElementsPassed = firstTrailingIcon && secondTrailingIcon && avatar

    useEffect(() => {
        setQuery('')
    }, [collection])

    const onQuerySubmitted = (): void => {
        onSearched(searchStrategy(query, collection))
    }
    const onQueryChanged: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setQuery(event.target.value)
    }

    return (
        <form
            aria-label="search"
            onSubmit={() => onQuerySubmitted()}
            className="md-search-bar-container"
        >
            <IconButton
                iconName="search"
                color={IconButtonColor.standard}
                onClick={onLeadingIconClicked ? onLeadingIconClicked : () => onQuerySubmitted()}
            />
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={onQueryChanged}
                className="md-search-bar-input"
            />
            {!allElementsPassed && firstTrailingIcon && (
                <IconButton
                    iconName={firstTrailingIcon.iconName}
                    color={IconButtonColor.standard}
                    onClick={
                        firstTrailingIcon.onIconClicked
                            ? firstTrailingIcon.onIconClicked
                            : () => onQuerySubmitted()
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
                            : () => onQuerySubmitted()
                    }
                />
            )}
            {!allElementsPassed && avatar && (
                <img
                    src={avatar.uri}
                    onClick={
                        avatar.onAvatarClicked ? avatar.onAvatarClicked : () => onQuerySubmitted()
                    }
                    className="md-search-bar-avatar"
                />
            )}
        </form>
    )
}

export default SearchBar
