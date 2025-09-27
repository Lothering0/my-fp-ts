import * as Result from '../Result'
import * as Functor_ from '../../typeclasses/Functor'
import { AsyncResultHkt, toPromise, AsyncResult } from './async-result'

export const Functor: Functor_.Functor<AsyncResultHkt> = {
  map: ab => self => () => toPromise(self).then(Result.map(ab)),
}

export const map: {
  <In, Out>(
    ab: (a: In) => Out,
  ): <Failure>(self: AsyncResult<Failure, In>) => AsyncResult<Failure, Out>
} = Functor.map
