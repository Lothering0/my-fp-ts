import * as Functor_ from '../../typeclasses/Functor'
import { flow } from '../../utils/flow'
import { Reader, ReaderHkt } from './reader'

export const Functor: Functor_.Functor<ReaderHkt> = {
  map: ab => self => flow(self, ab),
}

export const map: {
  <Fixed, In, Out>(
    ab: (a: In) => Out,
  ): (self: Reader<Fixed, In>) => Reader<Fixed, Out>
} = Functor.map
