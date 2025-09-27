import * as Contravariant_ from './Contravariant'
import { Hkt } from './Hkt'
import { Semigroup } from './Semigroup'
import { Monoid } from './Monoid'
import { constant, constTrue } from '../utils/constant'

export interface Equivalence<In> {
  readonly equals: (y: In) => (x: In) => boolean
}

export interface EquivalenceHkt extends Hkt {
  readonly Type: Equivalence<this['In']>
}

export const EquivalenceStrict: Equivalence<unknown> = {
  equals: y => x => x === y,
}

export const reverse: {
  <In>(Equivalence: Equivalence<In>): Equivalence<In>
} = Equivalence => ({
  equals: y => x => !Equivalence.equals(y)(x),
})

export const Contravariant: Contravariant_.Contravariant<EquivalenceHkt> = {
  contramap: ba => self => ({
    equals: y => x => self.equals(ba(y))(ba(x)),
  }),
}

export const contramap: {
  <In, Out>(ba: (b: Out) => In): (self: Equivalence<In>) => Equivalence<Out>
} = Contravariant.contramap

export const getSemigroup: {
  <In>(): Semigroup<Equivalence<In>>
} = () => ({
  combine: Eq1 => Eq2 => ({
    equals: y => x =>
      EquivalenceStrict.equals(Eq1.equals(y)(x))(Eq2.equals(y)(x)),
  }),
})

export const empty: Equivalence<never> = {
  equals: constant(constTrue),
}

export const getMonoid: {
  <In>(): Monoid<Equivalence<In>>
} = () => ({
  ...getSemigroup(),
  empty,
})
