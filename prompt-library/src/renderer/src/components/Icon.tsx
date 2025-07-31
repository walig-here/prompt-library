import { IconProps } from './props/IconProps'
import '../assets/components/Icon.css'
import { useEffect, useState } from 'react'

/**
 * Icon (symbol) that follows M3 principles.
 *
 * Specs: https://developers.google.com/fonts/docs/material_symbols
 *
 * Icon would be rendered only when `name` prop targets existing material symbol that could be fetched from
 * Google's API: https://fonts.googleapis.com/css2
 */
const Icon: React.FunctionComponent<IconProps> = ({ name, weight = 400, size = 24 }: IconProps) => {
    const [isValid, setIsValid] = useState<boolean>(true)
    const style = `material-symbols-outlined md-icon-${size}`

    useEffect(() => {
        _validateIcon(name)
            .then((isValid) => {
                if (!isValid)
                    console.warn(
                        `Icon won't be rendered. Reason: '${name}' is not an existing material symbol`
                    )
                setIsValid(isValid)
            })
            .catch(() => {
                setIsValid(false)
            })
    }, [name])

    if (!isValid) {
        return null
    }

    return (
        <>
            <link
                rel="stylesheet"
                href={`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@${size},${weight},0,0&icon_names=${name}`}
            />
            <span className={style}>{name}</span>
        </>
    )
}

const _validIconsCache = new Map<string, boolean>()

/**
 * Checks whether symbol with passed name exist in Google's material symbols base.
 *
 * @param iconName Name of validated symbol.
 */
async function _validateIcon(iconName: string): Promise<boolean> {
    if (_validIconsCache.has(iconName)) {
        return _validIconsCache.get(iconName)!
    }
    let isValid = false
    const iconRequestUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,400,0,0&icon_names=${iconName}`

    try {
        const iconRequestResponse = await fetch(iconRequestUrl)
        if (iconRequestResponse.ok) {
            const body = await iconRequestResponse.text()
            isValid = !body.includes('/* fallback */') // Google API is returning fallback when requested icon not exist
        } else {
            console.log(
                `Icon won't be rendered. Got code ${iconRequestResponse.status} for material icon "${iconName}" request.`
            )
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log(
            `Icon won't be rendered. Can't fetch material icon "${iconName}" from Google's API. Reason: ${errorMessage}`
        )
        return false // We don't cache this result since it can be temporar network issue and nothing permament
    }

    _validIconsCache.set(iconName, isValid)
    return isValid
}

export default Icon
