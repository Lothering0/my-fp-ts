import { URIS, URIS2 } from "../Kind"
import { overload } from "../../utils/overloads"
import { Applicative, Applicative2 } from "./Applicative"
import { Apply2Pointed, ApplyPointed } from "./Apply"

type CreateApplicative = <URI extends URIS>(
  applicative: CreateApplicativeArg<URI>,
) => Applicative<URI>
export const createApplicative: CreateApplicative = applicative => ({
  ...applicative,
  apply: overload (applicative.apply),
})

type CreateApplicative2 = <URI extends URIS2>(
  applicative: CreateApplicativeArg2<URI>,
) => Applicative2<URI>
export const createApplicative2: CreateApplicative2 =
  createApplicative as CreateApplicative2

interface CreateApplicativeArg<URI extends URIS>
  extends Omit<Applicative<URI>, "apply"> {
  readonly apply: ApplyPointed<URI>
}

interface CreateApplicativeArg2<URI extends URIS2>
  extends Omit<Applicative2<URI>, "apply"> {
  readonly apply: Apply2Pointed<URI>
}
