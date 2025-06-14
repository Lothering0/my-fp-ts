import * as O from "../Option"
import { Applicative, createApplicative } from "../../types/Applicative"
import { _URI, some, fromIoOption, IoOption } from "./io-option"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"

export const applicative: Applicative<typeof _URI> = createApplicative ({
  ...functor,
  of: some,
  apply:
    <A, B>(fma: IoOption<A>, fmf: IoOption<(a: A) => B>): IoOption<B> =>
    () =>
      pipe (
        O.Do,
        O.apS ("a", fromIoOption (fma)),
        O.apS ("f", fromIoOption (fmf)),
        O.map (({ a, f }) => f (a)),
      ),
})

export const { of, apply, ap } = applicative
