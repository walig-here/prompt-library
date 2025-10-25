import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import SearchBar from '../../../src/renderer/src/components/SearchBar'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import defineMockedGoogleApiResponses from '../../mocks/materialSymbolsApi'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'

describe('clicking buttons', () => {
    const testCollection: TestObject[] = []
    const searchCallbacks = {
        searchStrategy: (query: string, collection: TestObject[]): TestObject[] =>
            collection.filter((item) => item.name === query),
        onSearched: (result: TestObject[]): void => {
            result.values()
        }
    }
    const searchStrategySpy = vi.spyOn(searchCallbacks, 'searchStrategy')
    const onSearchSpy = vi.spyOn(searchCallbacks, 'onSearched')
    const customCallback = vi.fn()
    const user = userEvent.setup()

    beforeEach(() => {
        customCallback.mockClear()
        searchStrategySpy.mockClear()
        onSearchSpy.mockClear()
    })

    test('custom leading icon callback should execute when leading icon with custom callback defined is clicked', async () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={searchCallbacks.onSearched}
                searchStrategy={searchCallbacks.searchStrategy}
                onLeadingIconClicked={customCallback}
            />
        )
        const leadingIcon = screen.getByRole('button')

        await user.click(leadingIcon)

        expect(customCallback).toHaveBeenCalledOnce()
        expect(searchStrategySpy).not.toHaveBeenCalled()
        expect(onSearchSpy).not.toHaveBeenCalled()
    })

    test('search should be performed when leading icon with no callback defined is clicked', async () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={searchCallbacks.onSearched}
                searchStrategy={searchCallbacks.searchStrategy}
            />
        )
        const leadingIcon = screen.getByRole('button')

        await user.click(leadingIcon)

        expect(customCallback).not.toHaveBeenCalledOnce()
        expect(searchStrategySpy).toHaveBeenCalled()
        expect(onSearchSpy).toHaveBeenCalled()
    })

    test('custom avatar callback should execute when avatar with custom callback defined is clicked', async () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={searchCallbacks.onSearched}
                searchStrategy={searchCallbacks.searchStrategy}
                avatar={{ uri: '', onAvatarClicked: customCallback }}
            />
        )
        const avatar = screen.getByRole('img')

        await user.click(avatar)

        expect(customCallback).toHaveBeenCalledOnce()
        expect(searchStrategySpy).not.toHaveBeenCalled()
        expect(onSearchSpy).not.toHaveBeenCalled()
    })

    test('search should be performed when avatar with no callback defined is clicked', async () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={searchCallbacks.onSearched}
                searchStrategy={searchCallbacks.searchStrategy}
                avatar={{ uri: '' }}
            />
        )
        const avatar = screen.getByRole('img')

        await user.click(avatar)

        expect(customCallback).not.toHaveBeenCalledOnce()
        expect(searchStrategySpy).toHaveBeenCalled()
        expect(onSearchSpy).toHaveBeenCalled()
    })

    test('custom callback should be perfomred when first trailing icon with custom callback defined is clicked', async () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={searchCallbacks.onSearched}
                searchStrategy={searchCallbacks.searchStrategy}
                firstTrailingIcon={{ iconName: 'icon', onIconClicked: customCallback }}
            />
        )
        const firstTrailingIcon = screen.getByText(/icon/i)

        await user.click(firstTrailingIcon)

        expect(customCallback).toHaveBeenCalledOnce()
        expect(searchStrategySpy).not.toHaveBeenCalled()
        expect(onSearchSpy).not.toHaveBeenCalled()
    })

    test('search should be performed when first trailing icon with no callback defined is clicked', async () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={searchCallbacks.onSearched}
                searchStrategy={searchCallbacks.searchStrategy}
                firstTrailingIcon={{ iconName: 'icon' }}
            />
        )
        const firstTrailingIcon = screen.getByText(/icon/i)

        await user.click(firstTrailingIcon)

        expect(customCallback).not.toHaveBeenCalledOnce()
        expect(searchStrategySpy).toHaveBeenCalled()
        expect(onSearchSpy).toHaveBeenCalled()
    })

    test('custom callback should be perfomred when second trailing icon with custom callback defined is clicked', async () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={searchCallbacks.onSearched}
                searchStrategy={searchCallbacks.searchStrategy}
                firstTrailingIcon={{ iconName: 'trailing_1' }}
                secondTrailingIcon={{ iconName: 'trailing_2', onIconClicked: customCallback }}
            />
        )
        const secondTrailingIcon = screen.getByText(/trailing_2/i)

        await user.click(secondTrailingIcon)

        expect(customCallback).toHaveBeenCalledOnce()
        expect(searchStrategySpy).not.toHaveBeenCalled()
        expect(onSearchSpy).not.toHaveBeenCalled()
    })

    test('search should be performed when second trailing icon with no callback defined is clicked', async () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={searchCallbacks.onSearched}
                searchStrategy={searchCallbacks.searchStrategy}
                firstTrailingIcon={{ iconName: 'trailing_1' }}
                secondTrailingIcon={{ iconName: 'trailing_2' }}
            />
        )
        const secondTrailingIcon = screen.getByText(/trailing_2/i)

        await user.click(secondTrailingIcon)

        expect(customCallback).not.toHaveBeenCalledOnce()
        expect(searchStrategySpy).toHaveBeenCalled()
        expect(onSearchSpy).toHaveBeenCalled()
    })
})

describe('resetting', () => {
    const collection: TestObject[] = [
        { name: 'test 1a' },
        { name: 'avxc' },
        { name: 'pdsta3e' },
        { name: 'xyza' }
    ]

    test('query string should be cleared when queried collection changes', async () => {
        const user = userEvent.setup()
        const TestParent: React.FunctionComponent<EmptyProps> = () => {
            const [parentCollection, setParentCollection] = useState<TestObject[]>(collection)

            return (
                <>
                    <button
                        onClick={() =>
                            setParentCollection((parentCollection) => parentCollection.slice(0, -1))
                        }
                    >
                        Modify collection
                    </button>
                    <SearchBar
                        collection={parentCollection}
                        searchStrategy={(query: string, collection: TestObject[]): TestObject[] => {
                            return collection.filter((item) => item.name.includes(query))
                        }}
                        onSearched={(result: TestObject[]) => {
                            result.length.valueOf()
                        }}
                    />
                </>
            )
        }
        render(<TestParent />)
        const searchBar = screen.getByRole('textbox')

        await user.type(searchBar, 'abc{enter}')
        screen.getByDisplayValue('abc')
        await user.click(screen.getByText(/modify collection/i))

        await waitFor(() => {
            const updatedSearchBar = screen.queryByDisplayValue('')
            expect(updatedSearchBar).toBeInTheDocument()
        })
    })
})

describe('searching', () => {
    const collection: TestObject[] = [
        { name: 'test 1a' },
        { name: 'avxc' },
        { name: 'pdsta3e' },
        { name: 'xyza' }
    ]

    test('only matching objects from collection should be returned when user inputs and confirms pattern', async () => {
        let actualResult: TestObject[] = []
        const user = userEvent.setup()
        render(
            <SearchBar
                collection={collection}
                searchStrategy={(query: string, collection: TestObject[]): TestObject[] => {
                    return collection.filter((item) => item.name.includes(query))
                }}
                onSearched={(result: TestObject[]) => {
                    actualResult = result
                }}
            />
        )
        const searchBar = screen.getByRole('textbox')

        await user.type(searchBar, 'st{enter}')

        expect(actualResult).containSubset([{ name: 'test 1a' }, { name: 'pdsta3e' }])
    })

    test('no objects from collection should be returned when user input but not confirms pattern', async () => {
        let actualResult: TestObject[] = []
        const user = userEvent.setup()
        render(
            <SearchBar
                collection={collection}
                searchStrategy={(query: string, collection: TestObject[]): TestObject[] => {
                    return collection.filter((item) => item.name.includes(query))
                }}
                onSearched={(result: TestObject[]) => {
                    actualResult = result
                }}
            />
        )
        const searchBar = screen.getByRole('textbox')

        await user.type(searchBar, 'st')

        expect(actualResult.length).toBe(0)
    })

    test('no object from collection should be returned when user inputs pattern that matches no object', async () => {
        let actualResult: TestObject[] = [{ name: 'a' }]
        const user = userEvent.setup()
        render(
            <SearchBar
                collection={collection}
                searchStrategy={(query: string, collection: TestObject[]): TestObject[] => {
                    return collection.filter((item) => item.name.includes(query))
                }}
                onSearched={(result: TestObject[]) => {
                    actualResult = result
                }}
            />
        )
        const searchBar = screen.getByRole('textbox')

        await user.type(searchBar, 'R{enter}')

        expect(actualResult.length).toBe(0)
    })

    test('whole collection should be returned when user inputs pattern that maches each object', async () => {
        let actualResult: TestObject[] = []
        const user = userEvent.setup()
        render(
            <SearchBar
                collection={collection}
                searchStrategy={(query: string, collection: TestObject[]): TestObject[] => {
                    return collection.filter((item) => item.name.includes(query))
                }}
                onSearched={(result: TestObject[]) => {
                    actualResult = result
                }}
            />
        )
        const searchBar = screen.getByRole('textbox')

        await user.type(searchBar, 'a{enter}')

        expect(actualResult).toStrictEqual(collection)
    })
})

describe('render search bar', () => {
    const testCollection: { name: string }[] = []
    const emptyClickEventHanlder = (): void => {}
    const testSearchStrategy = (
        query: string,
        collection: { name: string }[]
    ): { name: string }[] => collection.filter((item) => item.name === query)

    test('leading icon and trailing avatar are rendered when only avatar data is passed', () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={(result) => result}
                searchStrategy={testSearchStrategy}
                avatar={{ onAvatarClicked: emptyClickEventHanlder, uri: 'image.png' }}
            />
        )
        const searchBar = screen.getByRole('form')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.getAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(1)
        expect(avatar.length).toBe(1)
    })

    test('leading icon and trailing icon are rendered when only first trailing icon data is passed', () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={(result) => result}
                searchStrategy={testSearchStrategy}
                firstTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
            />
        )
        const searchBar = screen.getByRole('form')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.queryAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(2)
        expect(avatar.length).toBe(0)
    })

    test('leading icon is rendered when only second trailing icon data is passed', () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={(result) => result}
                searchStrategy={testSearchStrategy}
                secondTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
            />
        )
        const searchBar = screen.getByRole('form')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.queryAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(1)
        expect(avatar.length).toBe(0)
    })

    test("leading icon is rendered when only no elements' data is passed", () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={(result) => result}
                searchStrategy={testSearchStrategy}
            />
        )
        const searchBar = screen.getByRole('form')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.queryAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(1)
        expect(avatar.length).toBe(0)
    })

    test("leading icon is rendered when only all elements' data is passed", () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={(result) => result}
                searchStrategy={testSearchStrategy}
                avatar={{ onAvatarClicked: emptyClickEventHanlder, uri: 'image.png' }}
                firstTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
                secondTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
            />
        )
        const searchBar = screen.getByRole('form')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.queryAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(1)
        expect(avatar.length).toBe(0)
    })

    test('leading icon and 2 trailing icons are rendered when only both trailing icons data is passed', () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={(result) => result}
                searchStrategy={testSearchStrategy}
                firstTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
                secondTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
            />
        )
        const searchBar = screen.getByRole('form')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.queryAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(3)
        expect(avatar.length).toBe(0)
    })

    test('leading icon and 1 trailing icon and trailing avatar are rendered when only first trailing icon and avatar data is passed', () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={(result) => result}
                searchStrategy={testSearchStrategy}
                firstTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
                avatar={{ onAvatarClicked: emptyClickEventHanlder, uri: 'image.png' }}
            />
        )
        const searchBar = screen.getByRole('form')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.getAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(2)
        expect(avatar.length).toBe(1)
    })

    test('leading icon and 1 trailing icon and trailing avatar are rendered when only second trailing icon and avatar data is passed', () => {
        render(
            <SearchBar
                collection={testCollection}
                onSearched={(result) => result}
                searchStrategy={testSearchStrategy}
                secondTrailingIcon={{ iconName: 'icon', onIconClicked: emptyClickEventHanlder }}
                avatar={{ onAvatarClicked: emptyClickEventHanlder, uri: 'image.png' }}
            />
        )
        const searchBar = screen.getByRole('form')
        const iconButtons = screen.getAllByRole('button')
        const avatar = screen.getAllByRole('img')

        expect(searchBar).toBeInTheDocument()
        expect(iconButtons.length).toBe(2)
        expect(avatar.length).toBe(1)
    })
})

interface TestObject {
    name: string
}

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
