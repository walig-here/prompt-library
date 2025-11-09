import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import SearchBar from '../../../src/renderer/src/components/SearchBar'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import defineMockedGoogleApiResponses from '../../mocks/materialSymbolsApi'
import userEvent from '@testing-library/user-event'

describe('changing query', () => {
    const user = userEvent.setup()
    const onChangeCallbackMock = vi.fn()

    test('change callback should be called each time when user writes in search input', async () => {
        // Arrange
        render(<SearchBar query="" onChanged={onChangeCallbackMock} />)

        // Act
        await user.type(screen.getByRole('search'), 'abc')

        // Assert
        expect(onChangeCallbackMock).toBeCalledTimes(3)
    })
})

describe('clicking buttons', () => {
    const callbacks = {
        onChanged: (): void => {}
    }
    const onChangedSpy = vi.spyOn(callbacks, 'onChanged')
    const customCallback = vi.fn()
    const user = userEvent.setup()

    beforeEach(() => {
        customCallback.mockClear()
        onChangedSpy.mockClear()
    })

    test('custom leading icon callback should execute when leading icon with custom callback defined is clicked', async () => {
        render(
            <SearchBar
                query=""
                onChanged={callbacks.onChanged}
                onLeadingIconClicked={customCallback}
            />
        )
        const leadingIcon = screen.getByRole('button')

        await user.click(leadingIcon)

        expect(customCallback).toHaveBeenCalledOnce()
        expect(onChangedSpy).not.toHaveBeenCalled()
    })

    test('nothing should happen when leading icon with no callback defined is clicked', async () => {
        render(<SearchBar query="" onChanged={callbacks.onChanged} />)
        const leadingIcon = screen.getByRole('button')

        await user.click(leadingIcon)

        expect(customCallback).not.toHaveBeenCalledOnce()
        expect(onChangedSpy).not.toHaveBeenCalled()
    })

    test('custom avatar callback should execute when avatar with custom callback defined is clicked', async () => {
        render(
            <SearchBar
                query=""
                onChanged={callbacks.onChanged}
                avatar={{ uri: ' ', onAvatarClicked: customCallback }}
            />
        )
        const avatar = screen.getByRole('img')

        await user.click(avatar)

        expect(customCallback).toHaveBeenCalledOnce()
        expect(onChangedSpy).not.toHaveBeenCalled()
    })

    test('nothing should happen when avatar with no callback defined is clicked', async () => {
        render(<SearchBar query="" onChanged={callbacks.onChanged} avatar={{ uri: ' ' }} />)
        const avatar = screen.getByRole('img')

        await user.click(avatar)

        expect(customCallback).not.toHaveBeenCalledOnce()
        expect(onChangedSpy).not.toHaveBeenCalled()
    })

    test('custom callback should be perfomred when first trailing icon with custom callback defined is clicked', async () => {
        render(
            <SearchBar
                query=""
                onChanged={callbacks.onChanged}
                firstTrailingIcon={{ iconName: 'icon', onIconClicked: customCallback }}
            />
        )
        const firstTrailingIcon = screen.getByText(/icon/i)

        await user.click(firstTrailingIcon)

        expect(customCallback).toHaveBeenCalledOnce()
        expect(onChangedSpy).not.toHaveBeenCalled()
    })

    test('nothing should happen when first trailing icon with no callback defined is clicked', async () => {
        render(
            <SearchBar
                query=""
                onChanged={callbacks.onChanged}
                firstTrailingIcon={{ iconName: 'icon' }}
            />
        )
        const firstTrailingIcon = screen.getByText(/icon/i)

        await user.click(firstTrailingIcon)

        expect(customCallback).not.toHaveBeenCalledOnce()
        expect(onChangedSpy).not.toHaveBeenCalled()
    })

    test('custom callback should be perfomred when second trailing icon with custom callback defined is clicked', async () => {
        render(
            <SearchBar
                onChanged={callbacks.onChanged}
                query=""
                firstTrailingIcon={{ iconName: 'trailing_1' }}
                secondTrailingIcon={{ iconName: 'trailing_2', onIconClicked: customCallback }}
            />
        )
        const secondTrailingIcon = screen.getByText(/trailing_2/i)

        await user.click(secondTrailingIcon)

        expect(customCallback).toHaveBeenCalledOnce()
        expect(onChangedSpy).not.toHaveBeenCalled()
    })

    test('nothing should happen when second trailing icon with no callback defined is clicked', async () => {
        render(
            <SearchBar
                query=""
                onChanged={callbacks.onChanged}
                firstTrailingIcon={{ iconName: 'trailing_1' }}
                secondTrailingIcon={{ iconName: 'trailing_2' }}
            />
        )
        const secondTrailingIcon = screen.getByText(/trailing_2/i)

        await user.click(secondTrailingIcon)

        expect(customCallback).not.toHaveBeenCalledOnce()
        expect(onChangedSpy).not.toHaveBeenCalled()
    })
})

describe('render search bar', () => {
    const emptyClickEventHanlder = (): void => {}

    test('value from query should be assigned to input', () => {
        // Arrange & Act
        render(
            <SearchBar
                query="test-query"
                onChanged={() => {}}
                avatar={{ uri: 'image.png', onAvatarClicked: emptyClickEventHanlder }}
            />
        )

        // Assert
        const searchInput: HTMLInputElement = screen.getByRole('search')
        expect(searchInput.value).toBe('test-query')
    })

    test('leading icon and trailing avatar are rendered when only avatar data is passed', () => {
        render(
            <SearchBar
                query=""
                onChanged={() => {}}
                avatar={{ onAvatarClicked: emptyClickEventHanlder, uri: 'image.png' }}
            />
        )
        const searchBar = screen.getByRole('searchbox')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.getAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(1)
        expect(avatar.length).toBe(1)
    })

    test('leading icon and trailing icon are rendered when only first trailing icon data is passed', () => {
        render(
            <SearchBar
                query=""
                onChanged={() => {}}
                firstTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
            />
        )
        const searchBar = screen.getByRole('searchbox')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.queryAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(2)
        expect(avatar.length).toBe(0)
    })

    test('leading icon is rendered when only second trailing icon data is passed', () => {
        render(
            <SearchBar
                query=""
                onChanged={() => {}}
                secondTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
            />
        )
        const searchBar = screen.getByRole('searchbox')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.queryAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(1)
        expect(avatar.length).toBe(0)
    })

    test("leading icon is rendered when only no elements' data is passed", () => {
        render(<SearchBar query="" onChanged={() => {}} />)
        const searchBar = screen.getByRole('searchbox')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.queryAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(1)
        expect(avatar.length).toBe(0)
    })

    test("leading icon is rendered when only all elements' data is passed", () => {
        render(
            <SearchBar
                query=""
                onChanged={() => {}}
                avatar={{ onAvatarClicked: emptyClickEventHanlder, uri: 'image.png' }}
                firstTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
                secondTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
            />
        )
        const searchBar = screen.getByRole('searchbox')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.queryAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(1)
        expect(avatar.length).toBe(0)
    })

    test('leading icon and 2 trailing icons are rendered when only both trailing icons data is passed', () => {
        render(
            <SearchBar
                query=""
                onChanged={() => {}}
                firstTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
                secondTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
            />
        )
        const searchBar = screen.getByRole('searchbox')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.queryAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(3)
        expect(avatar.length).toBe(0)
    })

    test('leading icon and 1 trailing icon and trailing avatar are rendered when only first trailing icon and avatar data is passed', () => {
        render(
            <SearchBar
                firstTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
                query=""
                onChanged={() => {}}
                avatar={{ onAvatarClicked: emptyClickEventHanlder, uri: 'image.png' }}
            />
        )
        const searchBar = screen.getByRole('searchbox')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.getAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(2)
        expect(avatar.length).toBe(1)
    })

    test('leading icon and 1 trailing icon and trailing avatar are rendered when only second trailing icon and avatar data is passed', () => {
        render(
            <SearchBar
                secondTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
                query=""
                onChanged={() => {}}
                avatar={{ onAvatarClicked: emptyClickEventHanlder, uri: 'image.png' }}
            />
        )
        const searchBar = screen.getByRole('searchbox')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.getAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(2)
        expect(avatar.length).toBe(1)
    })
})

const materialSymbolsApiMock = defineMockedGoogleApiResponses([])

beforeAll(() => {
    materialSymbolsApiMock.listen()
})
afterAll(() => {
    materialSymbolsApiMock.close()
})
afterEach(() => {
    materialSymbolsApiMock.resetHandlers()
})
