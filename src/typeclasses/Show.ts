import * as Contravariant_ from './Contravariant'
import { Hkt } from './Hkt'
import { flow } from '../utils/flow'

export interface Show<S> {
  readonly show: (s: S) => string
}

export interface ShowHkt extends Hkt {
  readonly Type: Show<this['Fixed']>
}

export const Contravariant: Contravariant_.Contravariant<ShowHkt> = {
  contramap: ts => self => ({
    show: flow(ts, self.show),
  }),
}

export const contramap: {
  <T, S>(ts: (t: T) => S): (self: Show<S>) => Show<T>
} = Contravariant.contramap
