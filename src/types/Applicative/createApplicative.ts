import { URIS, URIS2 } from "../Kind"
import { Applicative, Applicative2 } from "./Applicative"
import { Apply2Pointed, ApplyPointed } from "./Apply"
import { overload } from "../../utils/overloads"
import { pipe } from "../../utils/flow"
import { curry } from "../../utils/curry"
import { uncurry } from "../../utils/uncurry"
import { flip } from "../../utils/flip"

type CreateApplicative = <URI extends URIS>(
  applicative: CreateApplicativeArg<URI>,
) => Applicative<URI>
export const createApplicative: CreateApplicative = applicative => ({
  ...applicative,
  apply: overload (applicative.apply),
  ap: pipe (applicative.apply, curry, flip, uncurry, overload),
})

type CreateApplicative2 = <URI extends URIS2>(
  applicative: CreateApplicativeArg2<URI>,
) => Applicative2<URI>
export const createApplicative2: CreateApplicative2 =
  createApplicative as CreateApplicative2

interface CreateApplicativeArg<URI extends URIS>
  extends Omit<Applicative<URI>, "apply" | "ap"> {
  readonly apply: ApplyPointed<URI>
}

interface CreateApplicativeArg2<URI extends URIS2>
  extends Omit<Applicative2<URI>, "apply" | "ap"> {
  readonly apply: Apply2Pointed<URI>
}
