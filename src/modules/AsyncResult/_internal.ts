import * as Async from '../Async'
import * as Result from '../Result'

export const _AsyncResult = Result.transform(Async.Monad)
