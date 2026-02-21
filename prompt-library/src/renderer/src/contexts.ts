import { createContext } from 'react'

export interface ContentWidthContextData {
    value: string
    setWidth: (newWidthClass: string) => void
}

export const ContentWidthContext = createContext<ContentWidthContextData>({
    value: 'main-content',
    setWidth: () => {}
})
