import * as Async from '../Async'
import * as AsyncResult from '../AsyncResult'
import * as Result from '../Result'
import * as Option from '../Option'
import { Hkt } from '../../typeclasses/Hkt'
import { identity } from '../Identity'
import { constant } from '../../utils/constant'
import { flow } from '../../utils/flow'

export interface AsyncOptionHkt extends Hkt {
  readonly Type: AsyncOption<this['In']>
}

export interface AsyncOption<A> extends Async.Async<Option.Option<A>> {}

export const none: AsyncOption<never> = Async.of(Option.none)

export const some: {
  <A>(a: A): AsyncOption<A>
} = flow(Option.some, Async.of)

export const toPromise: {
  <A>(ma: AsyncOption<A>): Promise<Option.Option<A>>
} = mma => mma().then(identity, constant(Option.none))

export const fromAsync: {
  <A>(ma: Async.Async<A>): AsyncOption<A>
} = ma => () => ma().then(Option.some, () => Option.none)

export const fromAsyncResult: {
  <A, E>(ma: AsyncResult.AsyncResult<A, E>): AsyncOption<A>
} = ma => () =>
  ma().then(
    Result.match({
      onFailure: constant(Option.none),
      onSuccess: Option.some,
    }),
    constant(Option.none),
  )
