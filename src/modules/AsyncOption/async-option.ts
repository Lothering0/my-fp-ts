import * as Async from '../Async'
import * as AsyncResult from '../AsyncResult'
import * as Result from '../Result'
import * as Option from '../Option'
import { Hkt } from '../../typeclasses/Hkt'
import { constant } from '../../utils/constant'
import { _AsyncOption } from './_internal'

export interface AsyncOptionHkt extends Hkt {
  readonly Type: AsyncOption<this['In']>
}

export interface AsyncOption<A> extends Async.Async<Option.Option<A>> {}

export const none: {
  <A = never>(): AsyncOption<A>
} = _AsyncOption.none

export const some: {
  <A>(a: A): AsyncOption<A>
} = _AsyncOption.some

const try_: {
  <A>(operation: () => Promise<A>): AsyncOption<A>
} = operation => () => {
  try {
    return operation().then(Option.some, Option.none)
  } catch {
    return Promise.resolve(Option.none())
  }
}

export { try_ as try }

export const toPromise: {
  <A>(ma: AsyncOption<A>): Promise<Option.Option<A>>
} = mma => mma()

export const fromAsync: {
  <A>(ma: Async.Async<A>): AsyncOption<A>
} = ma => () => ma().then(Option.some)

export const fromAsyncResult: {
  <A, E>(ma: AsyncResult.AsyncResult<A, E>): AsyncOption<A>
} = ma => () =>
  ma().then(
    Result.match({
      onFailure: constant(Option.none()),
      onSuccess: Option.some,
    }),
  )
