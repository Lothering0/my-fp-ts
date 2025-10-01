import * as Option from '../Option'
import * as Functor_ from '../../typeclasses/Functor'
import { AsyncOptionHkt, AsyncOption, toPromise } from './async-option'

export const Functor: Functor_.Functor<AsyncOptionHkt> = {
  map: ab => self => () => toPromise(self).then(Option.map(ab)),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: AsyncOption<A>) => AsyncOption<B>
} = Functor.map
