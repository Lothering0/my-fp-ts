import * as O from "../option"
import { Applicative, createApplicative } from "../../types/Applicative"
import { fromIoOption, IOOption } from "./io-option"
import { pipe } from "../../utils/pipe"

export const applicative: Applicative<"IOOption"> = createApplicative ({
  _URI: "IOOption",
  apply:
    <A, B>(fma: IOOption<A>, fmf: IOOption<(a: A) => B>): IOOption<B> =>
    () =>
      pipe (
        O.Do,
        O.apS ("a", fromIoOption (fma)),
        O.apS ("f", fromIoOption (fmf)),
        O.map (({ a, f }) => f (a)),
      ),
})

export const { apply } = applicative
