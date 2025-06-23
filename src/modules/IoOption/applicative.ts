import * as O from "../Option"
import { Applicative, createApplicative } from "../../types/Applicative"
import { URI, some, fromIoOption, IoOption } from "./io-option"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"

export const applicative: Applicative<URI> = createApplicative ({
  ...functor,
  of: some,
  ap:
    <A, B>(fmf: IoOption<(a: A) => B>, fma: IoOption<A>): IoOption<B> =>
    () =>
      pipe (
        O.Do,
        O.apS ("a", fromIoOption (fma)),
        O.apS ("f", fromIoOption (fmf)),
        O.map (({ a, f }) => f (a)),
      ),
})

export const { of, ap, apply, flap, flipApply } = applicative
