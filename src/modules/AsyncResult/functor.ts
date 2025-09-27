import * as Result from '../Result'
import * as Functor_ from '../../typeclasses/Functor'
import { AsyncResultHkt, toPromise, AsyncResult } from './async-result'

export const Functor: Functor_.Functor<AsyncResultHkt> = {
  map: ab => self => () => toPromise(self).then(Result.map(ab)),
}

export const map: {
  <A, B>(ab: (a: A) => B): <E>(self: AsyncResult<A, E>) => AsyncResult<B, E>
} = Functor.map
