type SuccessResult<T> = { success: true; result: T }

type FailedResult<E extends Error = Error> = { success: false; error: E }

type Result<T, E extends Error = Error> = SuccessResult<T> | FailedResult<E>
