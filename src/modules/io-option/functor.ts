import * as O from "../option"
import { createFunctor, Functor } from "../../types/Functor"
import { fromIoOption, IOOption } from "./io-option"
import { pipe } from "../../utils/flow"

export const functor: Functor<"IOOption"> = createFunctor ({
  _URI: "IOOption",
  map:
    <A, B>(fma: IOOption<A>, f: (a: A) => B): IOOption<B> =>
    () =>
      pipe (fma, fromIoOption, O.map (f)),
})

export const { map } = functor
