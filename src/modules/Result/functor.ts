import * as Functor_ from '../../typeclasses/Functor'
import { Result, Hkt, fail, succeed } from './result'
import { match } from './matchers'
import { flow } from '../../utils/flow'

export const Functor = Functor_.create<Hkt>({
  map: ab =>
    match({
      onFailure: fail,
      onSuccess: flow(ab, succeed),
    }),
})

export const map: {
  <A, B>(ab: (success: A) => B): <E>(result: Result<A, E>) => Result<B, E>
} = Functor.map

export const as: {
  <A>(a: A): <E>(result: Result<unknown, E>) => Result<A, E>
} = Functor.as
