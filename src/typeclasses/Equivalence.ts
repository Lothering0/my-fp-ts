import * as Contravariant_ from './Contravariant'
import { Hkt as Hkt_ } from './Hkt'
import { Semigroup } from './Semigroup'
import { Monoid } from './Monoid'
import { constant, constTrue } from '../utils/constant'

export interface Equivalence<S> {
  readonly equals: (y: S) => (x: S) => boolean
}

export interface Hkt extends Hkt_ {
  readonly Type: Equivalence<this['Fixed']>
}

export const EquivalenceStrict: Equivalence<unknown> = {
  equals: y => x => x === y,
}

export const reverse: {
  <S>(Equivalence: Equivalence<S>): Equivalence<S>
} = Equivalence => ({
  equals: y => x => !Equivalence.equals(y)(x),
})

export const Contravariant: Contravariant_.Contravariant<Hkt> = {
  contramap: ba => self => ({
    equals: y => x => self.equals(ba(y))(ba(x)),
  }),
}

export const contramap: {
  <T, S>(ts: (t: T) => S): (self: Equivalence<S>) => Equivalence<T>
} = Contravariant.contramap

export const getEquivalenceSemigroup: {
  <S>(): Semigroup<Equivalence<S>>
} = () => ({
  combine: Eq1 => Eq2 => ({
    equals: y => x =>
      EquivalenceStrict.equals(Eq1.equals(y)(x))(Eq2.equals(y)(x)),
  }),
})

export const empty: Equivalence<never> = {
  equals: constant(constTrue),
}

export const getEquivalenceMonoid: {
  <S>(): Monoid<Equivalence<S>>
} = () => ({
  ...getEquivalenceSemigroup(),
  empty,
})
