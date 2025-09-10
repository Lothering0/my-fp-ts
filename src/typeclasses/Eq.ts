import * as contravariant from "./Contravariant"
import { Hkt } from "./Hkt"
import { Semigroup } from "./Semigroup"
import { Monoid } from "./Monoid"
import { constant, constTrue } from "../utils/constant"

export interface Eq<In> {
  readonly equals: (y: In) => (x: In) => boolean
}

export interface EqHkt extends Hkt {
  readonly type: Eq<this["_in"]>
}

export const EqStrict: Eq<unknown> = {
  equals: y => x => x === y,
}

export const reverse: {
  <In>(Eq: Eq<In>): Eq<In>
} = Eq => ({
  equals: y => x => !Eq.equals (y) (x),
})

export const Contravariant: contravariant.Contravariant<EqHkt> = {
  contramap: ba => self => ({
    equals: y => x => self.equals (ba (y)) (ba (x)),
  }),
}

export const contramap: {
  <In, Out>(ba: (b: Out) => In): (self: Eq<In>) => Eq<Out>
} = Contravariant.contramap

export const getSemigroup: {
  <In>(): Semigroup<Eq<In>>
} = () => ({
  combine: Eq1 => Eq2 => ({
    equals: y => x => EqStrict.equals (Eq1.equals (y) (x)) (Eq2.equals (y) (x)),
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
