import * as result from '../Result'
import * as functor from '../../typeclasses/Functor'
import { AsyncResultHkt, toPromise, AsyncResult } from './async-result'

export const Functor: functor.Functor<AsyncResultHkt> = {
  map: ab => self => () => toPromise(self).then(result.map(ab)),
}

export const map: {
  <In, Out>(
    ab: (a: In) => Out,
  ): <Failure>(self: AsyncResult<Failure, In>) => AsyncResult<Failure, Out>
} = Functor.map
