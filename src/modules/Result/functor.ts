import * as Functor_ from '../../typeclasses/Functor'
import { Result, ResultHkt, fail, succeed } from './result'
import { match } from './matchers'
import { flow } from '../../utils/flow'

export const Functor = Functor_.create<ResultHkt>({
  map: ab =>
    match({
      onFailure: fail,
      onSuccess: flow(ab, succeed),
    }),
})

export const map: {
  <A, B>(ab: (success: A) => B): <E>(self: Result<A, E>) => Result<B, E>
} = Functor.map

export const as: {
  <A>(a: A): <E>(self: Result<unknown, E>) => Result<A, E>
} = Functor.as
