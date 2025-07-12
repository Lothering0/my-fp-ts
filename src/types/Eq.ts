import * as C from "./Contravariant"
import { HKT } from "./HKT"
import { overload } from "../utils/overloads"
import { Semigroup } from "./Semigroup"
import { Monoid } from "./Monoid"
import { constTrue } from "../utils/constant"

export interface Eq<A> {
  readonly equals: {
    (x: A): (y: A) => boolean
    (x: A, y: A): boolean
  }
}

export interface EqHKT extends HKT {
  readonly type: Eq<this["_A"]>
}

export const EqStrict: Eq<unknown> = {
  equals: overload (1, (x, y) => x === y),
}

export const Contravariant: C.Contravariant<EqHKT> = {
  contramap: overload (
    1,
    <A, B>(self: Eq<A>, ba: (b: B) => A): Eq<B> => ({
      equals: overload (1, (x, y) => self.equals (ba (x), ba (y))),
    }),
  ),
}

export const { contramap } = Contravariant

export const getSemigroup: {
  <A>(): Semigroup<Eq<A>>
} = () => ({
  concat: overload (1, (Eq1, Eq2) => ({
    equals: overload (1, (x, y) =>
      EqStrict.equals (Eq1.equals (x, y), Eq2.equals (x, y)),
    ),
  })),
})

export const getMonoid: {
  <A>(): Monoid<Eq<A>>
} = () => ({
  ...getSemigroup (),
  empty: {
    equals: overload (1, constTrue),
  },
})
