import { createApplicative } from "../../typeclasses/Applicative"
import { OptionHkt, Option, some } from "./option"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"
import { match } from "./matchers"
import { zero } from "./alternative"

export const Applicative = createApplicative<OptionHkt> ({
  ...Functor,
  of: some,
  ap: fa => self =>
    pipe (
      fa,
      match ({
        onNone: zero,
        onSome: a =>
          pipe (
            self,
            match ({
              onNone: zero,
              onSome: ab => pipe (a, ab, some),
            }),
          ),
      }),
    ),
})

export const of: {
  <A>(a: A): Option<A>
} = Applicative.of

export const ap: {
  <A>(fa: Option<A>): <B>(self: Option<(a: A) => B>) => Option<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B>(fab: Option<(a: A) => B>): (self: Option<A>) => Option<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
