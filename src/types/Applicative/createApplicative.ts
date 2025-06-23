import { URIS, URIS2 } from "../Kind"
import { Applicative, Applicative2 } from "./Applicative"
import { Ap2Pointed, ApPointed } from "./Ap"
import { overload } from "../../utils/overloads"
import { pipe } from "../../utils/flow"
import { curry } from "../../utils/curry"
import { uncurry } from "../../utils/uncurry"
import { flip } from "../../utils/flip"

type CreateApplicative = <URI extends URIS>(
  applicative: CreateApplicativeArg<URI>,
) => Applicative<URI>
export const createApplicative: CreateApplicative = applicative => {
  const ap = overload (1, applicative.ap)
  const flap = pipe (applicative.ap, curry, flip, uncurry, overload (1))

  return {
    ...applicative,
    ap,
    apply: ap,
    flap,
    flipApply: flap,
  }
}

type CreateApplicative2 = <URI extends URIS2>(
  applicative: CreateApplicativeArg2<URI>,
) => Applicative2<URI>
export const createApplicative2: CreateApplicative2 =
  createApplicative as CreateApplicative2

interface CreateApplicativeArg<URI extends URIS>
  extends Omit<Applicative<URI>, "ap" | "apply" | "flap" | "flipApply"> {
  readonly ap: ApPointed<URI>
}

interface CreateApplicativeArg2<URI extends URIS2>
  extends Omit<Applicative2<URI>, "ap" | "apply" | "flap" | "flipApply"> {
  readonly ap: Ap2Pointed<URI>
}
