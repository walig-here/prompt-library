export type IconWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700

export type IconSize = 20 | 24 | 40 | 48

export interface IconProps {
    name: string
    weight?: IconWeight
    size?: IconSize
}
