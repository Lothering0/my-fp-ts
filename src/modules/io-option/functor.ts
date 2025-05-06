import * as O from "../option"
import { createFunctor, Functor } from "../../types/Functor"
import { fromIoOption, IOOption, ioSome } from "./io-option"
import { pipe } from "../../utils/pipe"

export const functor: Functor<"IOOption"> = createFunctor ({
  _URI: "IOOption",
  of: ioSome,
  map:
    <A, B>(fma: IOOption<A>, f: (a: A) => B): IOOption<B> =>
    () =>
      pipe (fma, fromIoOption, O.map (f)),
})

export const { of, map } = functor
