import * as Result from '../Result'
import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Option, Hkt, some, none } from './option'
import { LazyArg } from '../../types/utils'
import { flow } from '../../utils/flow'
import { match } from './matchers'

export const FromResult: FromResult_<Hkt> = {
  fromResult: Result.match({ onFailure: none, onSuccess: some }),
}

export const fromResult: {
  <A, E>(result: Result.Result<A, E>): Option<A>
} = FromResult.fromResult

export const toResult: {
  <E>(onNone: LazyArg<E>): <A>(option: Option<A>) => Result.Result<A, E>
} = onNone =>
  match({
    onNone: flow(onNone, Result.fail),
    onSome: Result.succeed,
  })
