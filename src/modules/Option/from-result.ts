import * as Result from '../Result'
import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Option, OptionHkt, some } from './option'
import { LazyArg } from '../../types/utils'
import { flow } from '../../utils/flow'
import { match } from './matchers'
import { zero } from './alternative'

export const FromResult: FromResult_<OptionHkt> = {
  fromResult: Result.match({ onFailure: zero, onSuccess: some }),
}

export const fromResult: {
  <A, E>(ma: Result.Result<A, E>): Option<A>
} = FromResult.fromResult

export const toResult: {
  <E>(onNone: LazyArg<E>): <A>(self: Option<A>) => Result.Result<A, E>
} = onNone =>
  match({
    onNone: flow(onNone, Result.fail),
    onSome: Result.succeed,
  })
