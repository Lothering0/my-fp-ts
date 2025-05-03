import * as E from "../either"
import { Applicative2, createApplicative2 } from "../../types/Applicative"
import { fromIoEither, IOEither } from "./io-either"
import { pipe } from "../../utils/pipe"

export const applicative: Applicative2<"IOEither"> = createApplicative2 ({
  _URI: "IOEither",
  apply:
    <_, A, B>(
      fma: IOEither<_, A>,
      fmf: IOEither<_, (a: A) => B>,
    ): IOEither<_, B> =>
    () =>
      pipe (
        E.Do,
        E.apS ("a", fromIoEither (fma)),
        E.apS ("f", fromIoEither (fmf)),
        E.map (({ a, f }) => f (a)),
      ),
})

export const { apply } = applicative
