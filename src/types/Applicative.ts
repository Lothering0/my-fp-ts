import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { overloadWithPointFree } from "../utils/points"

export interface Applicative<URI extends URIS> {
  readonly _URI: URI
  readonly of: <A>(a: A) => HKT<URI, A>
  readonly apply: Apply<URI>
}

export interface Applicative2<URI extends URIS2> {
  readonly _URI: URI
  readonly of: <A>(a: A) => HKT2<URI, never, A>
  readonly apply: Apply2<URI>
}

type CreateApplicative = <URI extends URIS>(
  applicative: CreateApplicativeArg<URI>,
) => Applicative<URI>
export const createApplicative: CreateApplicative = applicative => ({
  ...applicative,
  apply: overloadWithPointFree (applicative.apply),
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
  readonly apply: ApplyPointed2<URI>
}

interface ApplyPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, ff: HKT<URI, (a: A) => B>): HKT<URI, B>
}

interface ApplyPointed2<URI extends URIS2> {
  <_, A, B>(fa: HKT2<URI, _, A>, ff: HKT2<URI, _, (a: A) => B>): HKT2<URI, _, B>
}

interface Apply<URI extends URIS> extends ApplyPointed<URI> {
  <A, B>(ff: HKT<URI, (a: A) => B>): (fa: HKT<URI, A>) => HKT<URI, B>
}

interface Apply2<URI extends URIS2> extends ApplyPointed2<URI> {
  <_, A, B>(
    ff: HKT2<URI, _, (a: A) => B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
