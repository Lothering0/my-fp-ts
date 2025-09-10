import { createApplicative } from "../../typeclasses/Applicative"
import { createApplicativeWithIndex } from "../../typeclasses/ApplicativeWithIndex"
import { Functor, FunctorWithIndex } from "./functor"
import { IterableHkt } from "./iterable"

export const Applicative = createApplicative<IterableHkt> ({
  ...Functor,
  of: a => ({
    *[Symbol.iterator]() {
      yield a
    },
  }),
  ap: fa => self => ({
    *[Symbol.iterator]() {
      for (const a of fa) {
        for (const ab of self) {
          yield ab (a)
        }
      }
    },
  }),
})

export const ApplicativeWithIndex = createApplicativeWithIndex<
  IterableHkt,
  number
> ({
  ...FunctorWithIndex,
  ...Applicative,
  apWithIndex: fa => self => ({
    *[Symbol.iterator]() {
      let i = -1
      for (const a of fa) {
        i++
        for (const aib of self) {
          yield aib (a, i)
        }
      }
    },
  }),
})

export const of: {
  <A>(a: A): Iterable<A>
} = Applicative.of

export const ap: {
  <A>(
    fa: Iterable<A>,
  ): <B>(self: Iterable<(a: A, i: number) => B>) => Iterable<B>
} = ApplicativeWithIndex.apWithIndex

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B>(
    fab: Iterable<(a: A, i: number) => B>,
  ): (self: Iterable<A>) => Iterable<B>
} = ApplicativeWithIndex.flapWithIndex

/** Alias for `flap` */
export const flipApply = flap
