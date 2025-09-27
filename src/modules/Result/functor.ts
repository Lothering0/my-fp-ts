import * as Functor_ from '../../typeclasses/Functor'
import { Result, ResultHkt, fail, succeed } from './result'
import { match } from './matchers'
import { flow } from '../../utils/flow'

export const Functor: Functor_.Functor<ResultHkt> = {
  map: ab =>
    match({
      onFailure: fail,
      onSuccess: flow(ab, succeed),
    }),
}

export const map: {
  <In, Out>(
    ab: (success: In) => Out,
  ): <Failure>(self: Result<Failure, In>) => Result<Failure, Out>
} = Functor.map
