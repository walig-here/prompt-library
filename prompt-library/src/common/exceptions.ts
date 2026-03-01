export function ensureError(thrownValue: unknown): Error {
    if (thrownValue instanceof Error) return thrownValue

    let stringified = '[Unable to stringify thrown value]'
    try {
        stringified = JSON.stringify(thrownValue)
    } catch {
        // continue regardless of error
    }

    return new Error(`This value was thrown explicitly, not through an Error: ${stringified}`)
}
