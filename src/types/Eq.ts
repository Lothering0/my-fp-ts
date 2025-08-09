import * as contravariant from "./Contravariant"
import { Hkt } from "./Hkt"
import { Semigroup } from "./Semigroup"
import { Monoid } from "./Monoid"
import { constant, constTrue } from "../utils/constant"

export interface Eq<A> {
  readonly equals: (x: A) => (y: A) => boolean
}

export interface EqHkt extends Hkt {
  readonly type: Eq<this["_A"]>
}

export const EqStrict: Eq<unknown> = {
  equals: x => y => x === y,
}

export const Contravariant: contravariant.Contravariant<EqHkt> = {
  contramap: ba => self => ({
    equals: x => y => self.equals (ba (x)) (ba (y)),
  }),
}

export const contramap: {
  <A, B>(ba: (b: B) => A): (self: Eq<A>) => Eq<B>
} = Contravariant.contramap

export const getSemigroup: {
  <A>(): Semigroup<Eq<A>>
} = () => ({
  combine: Eq1 => Eq2 => ({
    equals: x => y => EqStrict.equals (Eq1.equals (x) (y)) (Eq2.equals (x) (y)),
  }),
})

export const empty: Eq<never> = {
  equals: constant (constTrue),
}

export const getMonoid: {
  <A>(): Monoid<Eq<A>>
} = () => ({
  ...getSemigroup (),
  empty,
})
