import * as Contravariant_ from './Contravariant'
import { Hkt } from './Hkt'
import { flow } from '../utils/flow'

export interface Show<In> {
  readonly show: (a: In) => string
}

export interface ShowHkt extends Hkt {
  readonly Type: Show<this['In']>
}

export const Contravariant: Contravariant_.Contravariant<ShowHkt> = {
  contramap: ba => self => ({
    show: flow(ba, self.show),
  }),
}

export const contramap: {
  <A, B>(ba: (b: B) => A): (self: Show<A>) => Show<B>
} = Contravariant.contramap
