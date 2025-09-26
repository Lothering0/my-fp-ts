import { Result, ResultHkt, fail, succeed } from './result'
import { create } from '../../typeclasses/Bifunctor'
import { match } from './matchers'
import { flow } from '../../utils/flow'
import { Functor } from './functor'

export const Bifunctor = create<ResultHkt>(Functor, {
  mapLeft: ed =>
    match({
      onFailure: flow(ed, fail),
      onSuccess: succeed,
    }),
})

export const mapLeft: {
  <FailureIn, FailureOut>(
    ed: (failure: FailureIn) => FailureOut,
  ): <Out>(self: Result<FailureIn, Out>) => Result<FailureOut, Out>
} = Bifunctor.mapLeft

export const bimap: {
  <FailureIn, In, FailureOut, Out>(
    ed: (failure: FailureIn) => FailureOut,
    ab: (success: In) => Out,
  ): (self: Result<FailureIn, In>) => Result<FailureOut, Out>
} = Bifunctor.bimap
