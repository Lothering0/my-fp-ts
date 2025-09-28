import * as Functor_ from '../../typeclasses/Functor'
import { flow } from '../../utils/flow'
import { Reader, ReaderHkt } from './reader'

export const Functor: Functor_.Functor<ReaderHkt> = {
  map: ab => self => flow(self, ab),
}

export const map: {
  <R, A, B>(ab: (a: A) => B): (self: Reader<R, A>) => Reader<R, B>
} = Functor.map
