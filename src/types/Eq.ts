import * as contravariant from "./Contravariant"
import { Hkt } from "./Hkt"
import { Semigroup } from "./Semigroup"
import { Monoid } from "./Monoid"
import { constant, constTrue } from "../utils/constant"

export interface Eq<In> {
  readonly equals: (x: In) => (y: In) => boolean
}

export interface EqHkt extends Hkt {
  readonly type: Eq<this["_in"]>
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
  <In, Out>(ba: (b: Out) => In): (self: Eq<In>) => Eq<Out>
} = Contravariant.contramap

export const getSemigroup: {
  <In>(): Semigroup<Eq<In>>
} = () => ({
  combine: Eq1 => Eq2 => ({
    equals: x => y => EqStrict.equals (Eq1.equals (x) (y)) (Eq2.equals (x) (y)),
  }),
})

export const empty: Eq<never> = {
  equals: constant (constTrue),
}

export const getMonoid: {
  <In>(): Monoid<Eq<In>>
} = () => ({
  ...getSemigroup (),
  empty,
})
