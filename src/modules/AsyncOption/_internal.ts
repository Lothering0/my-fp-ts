import * as Async from '../Async'
import * as Option from '../Option'

export const _AsyncOption = Option.transform(Async.Monad)
