import * as O from "../Option"
import { createFunctor, Functor } from "../../types/Functor"
import { URI, fromIoOption, IoOption } from "./io-option"
import { pipe } from "../../utils/flow"

export const functor: Functor<URI> = createFunctor ({
  URI,
  map:
    <A, B>(fma: IoOption<A>, f: (a: A) => B): IoOption<B> =>
    () =>
      pipe (fma, fromIoOption, O.map (f)),
})

export const { map } = functor
