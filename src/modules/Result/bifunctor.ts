import { Result, Hkt, fail, succeed } from './result'
import { create } from '../../typeclasses/Bifunctor'
import { match } from './matchers'
import { flow } from '../../utils/flow'
import { Functor } from './functor'

export const Bifunctor = create<Hkt>(Functor, {
  mapLeft: ed =>
    match({
      onFailure: flow(ed, fail),
      onSuccess: succeed,
    }),
})

export const mapLeft: {
  <E1, E2>(ed: (failure: E1) => E2): <A>(result: Result<A, E1>) => Result<A, E2>
} = Bifunctor.mapLeft

export const bimap: {
  <E1, E2, A, B>(
    ed: (failure: E1) => E2,
    ab: (success: A) => B,
  ): (result: Result<A, E1>) => Result<B, E2>
} = Bifunctor.bimap
